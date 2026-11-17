import { css, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import type { styleMap } from 'lit/directives/style-map.js';

import { VOLTAGE_CARD_TYPE } from '../const';
import { outageWindows, SLOT_MS, type Window } from '../data/timeline';
import {
  fetchVoltage,
  voltageReport,
  type Extreme,
  type PhaseReport,
  type SlotView,
  type VoltageLimits,
  type VoltageReport,
  type VoltageSlot,
} from '../data/voltage';
import { DEFAULT_VOLTAGE_MAX, DEFAULT_VOLTAGE_MIN } from '../defaults';
import type { VoltageCardConfig, VoltagePhase } from '../types/config';
import type { HassEntity, HomeAssistant } from '../types/ha';
import type { QueuePayload } from '../types/payload';
import type { Formatter } from '../utils/format';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import type { SizeSetting } from './size';
import { renderStats, text, windowText, type StatView } from './parts';
import { findQueueEntity } from './stub';

const REFRESH_MS = 5 * 60_000;
const SLOTS = 48;
const TRACK = 44;
const NOMINAL = 230;
const BELOW = 17;
const ABOVE = 7;
const AXIS = [0, 0.25, 0.5, 0.75];

interface View {
  readonly now: number;
  readonly t: RenderContext['t'];
  readonly f: Formatter;
  readonly payload: QueuePayload | undefined;
  readonly size: SizeSetting;
}

interface Phase extends VoltagePhase {
  readonly name: string;
  readonly input: string;
}

function findVoltageEntities(hass: HomeAssistant): string[] {
  return Object.values(hass.states)
    .filter(
      (entity: HassEntity) =>
        entity.entity_id.startsWith('sensor.') && entity.attributes.device_class === 'voltage',
    )
    .map((entity) => entity.entity_id)
    .sort()
    .slice(0, 3);
}

export class BlackoutVoltageCard extends BlackoutBaseCard<VoltageCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    css`
      .phases {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .phase,
      .axis-row {
        display: grid;
        grid-template-columns: 28px minmax(0, 1fr) 44px;
        column-gap: 10px;
        align-items: center;
      }

      .phase-name {
        font-family: var(--bo-mono);
        font-size: 11px;
        font-weight: 600;
      }

      .track {
        position: relative;
        height: var(--track, ${TRACK}px);
        overflow: hidden;
        border-radius: 6px;
        background: var(--bo-surface);
      }

      .norm {
        position: absolute;
        right: 0;
        left: 0;
        background: color-mix(in srgb, var(--bo-on) 8%, transparent);
      }

      .nominal {
        position: absolute;
        right: 0;
        left: 0;
        border-top: 1px dashed var(--bo-divider);
      }

      .slots {
        position: absolute;
        inset: 0;
        display: flex;
      }

      .slot {
        position: relative;
        flex: 1 1 0;
        min-width: 0;
      }

      .slot.outage {
        background: var(--bo-hatch);
        opacity: 0.45;
      }

      .range {
        position: absolute;
        left: 50%;
        width: 3px;
        margin-left: -1.5px;
        border-radius: 2px;
        background: var(--bo-faint);
      }

      .range.out {
        background: var(--bo-off);
      }

      .output {
        position: absolute;
        right: 0;
        left: 0;
        height: 2px;
        background: var(--bo-on);
      }

      .share {
        color: var(--tone, var(--bo-text));
        font-family: var(--bo-mono);
        font-size: 11px;
        text-align: right;
        white-space: nowrap;
      }

      .axis {
        position: relative;
        height: 12px;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
        white-space: nowrap;
      }

      .axis span {
        position: absolute;
        top: 0;
        transform: translateX(-50%);
      }

      .axis span:first-child {
        transform: none;
      }

      .axis span.now {
        right: 0;
        transform: none;
      }

      .in-norm .mono {
        margin-left: 4px;
        color: var(--bo-text);
        font-size: 13px;
      }

      .legend {
        margin-top: 12px;
      }

      .swatch.range-swatch {
        width: 3px;
        height: 12px;
        border-radius: 2px;
        background: var(--bo-faint);
      }

      .swatch.range-swatch.out {
        background: var(--bo-off);
      }

      .swatch.output-swatch {
        width: 14px;
        height: 2px;
        border-radius: 1px;
        background: var(--bo-on);
      }

      .stats {
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--bo-divider);
      }

      .message {
        padding: 8px 0;
      }
    `,
  ];

  protected readonly cardSize = 5;

  @state() private accessor slots: readonly (readonly VoltageSlot[])[] = [];
  private loadedKey = '';
  private loadedAt = 0;

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): VoltageCardConfig {
    return {
      type: `custom:${VOLTAGE_CARD_TYPE}`,
      entity: findQueueEntity(hass),
      phases: findVoltageEntities(hass).map((input) => ({ input })),
    };
  }

  protected override requiresEntity(): boolean {
    return false;
  }

  protected override historyDays(): number {
    return 2;
  }

  protected defaultTitle(ctx: RenderContext): string {
    return ctx.t('title.voltage');
  }

  protected headerSide(ctx: RenderContext): TemplateResult | typeof nothing {
    return this.inNorm(ctx);
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);
    this.loadVoltage();
  }

  protected renderContent(ctx: RenderContext): TemplateResult {
    return this.renderBody(ctx);
  }

  protected override renderWithoutQueue(style: ReturnType<typeof styleMap>): TemplateResult {
    const view: View = {
      now: Date.now(),
      t: (key, params) => this.translator.t(key, params),
      f: this.formatter,
      payload: undefined,
      size: this.size(),
    };

    return html`<ha-card class=${this.cardClass()} style=${style}>
      ${
        this.config?.show_header === false
          ? nothing
          : html`<div class="header">
              <div class="title">${this.config?.title ?? view.t('title.voltage')}</div>
              <div class="header-side">${this.inNorm(view)}</div>
            </div>`
      }
      ${this.renderBody(view)}
    </ha-card>`;
  }

  private phases(): Phase[] {
    return (this.config?.phases ?? []).flatMap((phase, index) =>
      phase.input ? [{ ...phase, input: phase.input, name: `L${index + 1}` }] : [],
    );
  }

  private limits(): VoltageLimits {
    return {
      min: this.config?.voltage_min ?? DEFAULT_VOLTAGE_MIN,
      max: this.config?.voltage_max ?? DEFAULT_VOLTAGE_MAX,
    };
  }

  private windowStart(now: number): number {
    return Math.floor(now / SLOT_MS) * SLOT_MS - (SLOTS - 1) * SLOT_MS;
  }

  private outages(view: View, start: number): Window[] {
    const payload = view.payload;

    if (!payload) {
      return [];
    }

    const windows = payload.grid
      ? payload.days.flatMap((day) =>
          day.actual.map((outage) => ({
            start: Date.parse(outage.start),
            end: outage.end ? Date.parse(outage.end) : view.now,
            possible: false,
          })),
        )
      : payload.days.flatMap((day) =>
          day.status === 'waiting' ? [] : outageWindows(day).filter((window) => !window.possible),
        );

    return windows
      .map((window) => ({ ...window, end: Math.min(window.end, view.now) }))
      .filter((window) => window.end > start && window.start < window.end);
  }

  private report(view: View): VoltageReport {
    const start = this.windowStart(view.now);

    return voltageReport(this.slots, this.limits(), this.outages(view, start));
  }

  private inNorm(view: View): TemplateResult | typeof nothing {
    if (this.phases().length === 0) {
      return nothing;
    }

    const share = this.report(view).share;

    return html`<span class="in-norm"
      >${view.t('voltage.in_norm')}<span class="mono"
        >${share === null ? view.t('value.none') : `${view.f.number(share * 100, 0)} %`}</span
      ></span
    >`;
  }

  private renderBody(view: View): TemplateResult {
    const phases = this.phases();

    if (phases.length === 0) {
      return html`<div class="message">${view.t('voltage.configure')}</div>`;
    }

    const start = this.windowStart(view.now);
    const limits = this.limits();
    const outages = this.outages(view, start);
    const report = voltageReport(this.slots, limits, outages);
    const low = limits.min - BELOW;
    const high = limits.max + ABOVE;
    const small = view.size === 'small';
    const track =
      view.size === 'small' ? 22 : view.size === 'medium' ? 40 : view.size === 'large' ? 84 : TRACK;
    const scale = (volts: number): number =>
      ((high - Math.min(high, Math.max(low, volts))) / (high - low)) * track;

    return html`<div class="phases" style="--track:${track}px">
        ${phases.map((phase, index) =>
          this.renderPhase(view, phase, report.phases[index], limits, scale),
        )}
        <div class="axis-row">
          <span></span>
          <div class="axis">
            ${AXIS.map(
              (fraction) =>
                html`<span style="left:${fraction * 100}%"
                  >${view.f.time(start + fraction * SLOTS * SLOT_MS).slice(0, 2)}</span
                >`,
            )}
            <span class="now">${view.t('voltage.now')}</span>
          </div>
          <span></span>
        </div>
      </div>
      ${small ? nothing : this.renderLegend(view, phases, limits)}
      ${
        small
          ? nothing
          : html`<div class="foot" data-drop="2">
              ${renderStats(
                this.stats(view, phases, report.low, report.high, outages, start),
                view.size === 'medium',
              )}
            </div>`
      }`;
  }

  private renderPhase(
    view: View,
    phase: Phase,
    report: PhaseReport | undefined,
    limits: VoltageLimits,
    scale: (volts: number) => number,
  ): TemplateResult {
    const share = report?.share ?? null;
    const tone = share === null ? 'tone-muted' : share >= 0.95 ? 'tone-on' : 'tone-possible';

    return html`<div class="phase">
      <span class="phase-name">${phase.name}</span>
      <div class="track">
        <span
          class="norm"
          style="top:${scale(limits.max)}px;height:${scale(limits.min) - scale(limits.max)}px"
        ></span>
        <span class="nominal" style="top:${scale(NOMINAL)}px"></span>
        <div class="slots">
          ${(report?.slots ?? []).map((slot) => this.renderSlot(slot, scale))}
        </div>
      </div>
      <span class="share ${tone}"
        >${share === null ? view.t('value.none') : `${view.f.number(share * 100, 0)} %`}</span
      >
    </div>`;
  }

  private renderSlot(slot: SlotView, scale: (volts: number) => number): TemplateResult {
    if (slot.outage) {
      return html`<span class="slot outage"></span>`;
    }

    const top = slot.max === null ? null : scale(slot.max);
    const bottom = slot.min === null ? null : scale(slot.min);

    return html`<span class="slot"
      >${
        top === null || bottom === null
          ? nothing
          : html`<span
              class="range ${slot.ok === false ? 'out' : ''}"
              style="top:${top}px;height:${Math.max(2, bottom - top)}px"
            ></span>`
      }${
        slot.output === null
          ? nothing
          : html`<span class="output" style="top:${scale(slot.output) - 1}px"></span>`
      }</span
    >`;
  }

  private renderLegend(
    view: View,
    phases: readonly Phase[],
    limits: VoltageLimits,
  ): TemplateResult {
    const { t, f } = view;

    return html`<div class="legend" data-drop="1">
      <span class="legend-item"
        ><span class="swatch range-swatch"></span>${t('legend.voltage_input')}</span
      >
      <span class="legend-item"
        ><span class="swatch range-swatch out"></span>${t('legend.voltage_out', {
          min: f.number(limits.min, 0),
          max: f.number(limits.max, 0),
        })}</span
      >
      ${
        phases.some((phase) => phase.output)
          ? html`<span class="legend-item"
              ><span class="swatch output-swatch"></span>${t('legend.voltage_output')}</span
            >`
          : nothing
      }
      ${
        view.payload
          ? html`<span class="legend-item"
              ><span class="swatch hatch"></span>${t('legend.off')}</span
            >`
          : nothing
      }
    </div>`;
  }

  private extremeStat(
    view: View,
    label: string,
    phases: readonly Phase[],
    extreme: Extreme | null,
  ): StatView {
    const { t, f } = view;

    if (!extreme) {
      return { label, parts: text(t('value.none')) };
    }

    return {
      label,
      parts: [{ value: f.number(extreme.value, 0), unit: t('unit.v') }],
      note: `${phases[extreme.phase]?.name ?? ''} · ${f.time(extreme.time)}`,
    };
  }

  private stats(
    view: View,
    phases: readonly Phase[],
    low: Extreme | null,
    high: Extreme | null,
    outages: readonly Window[],
    start: number,
  ): StatView[] {
    const { t, f } = view;
    const stats = [
      this.extremeStat(view, t('stat.voltage_min'), phases, low),
      this.extremeStat(view, t('stat.voltage_max'), phases, high),
    ];

    if (!view.payload) {
      return stats;
    }

    const clipped = outages.map((window) => ({ ...window, start: Math.max(window.start, start) }));
    const total = clipped.reduce((sum, window) => sum + (window.end - window.start), 0);
    const only = clipped.length === 1 ? clipped[0] : undefined;
    const note = only
      ? windowText(f, only.start, only.end)
      : clipped.length > 1
        ? this.translator.plural('voltage.outages', clipped.length)
        : t('voltage.no_outages');

    return [...stats, { label: t('stat.outage_time'), parts: f.durationParts(total), note }];
  }

  private loadVoltage(): void {
    const hass = this.hass;
    const phases = this.phases();

    if (!hass || phases.length === 0) {
      return;
    }

    const now = Date.now();
    const start = this.windowStart(now);
    const key = `${JSON.stringify(phases)}|${start}`;

    if (key === this.loadedKey && now - this.loadedAt < REFRESH_MS) {
      return;
    }

    this.loadedKey = key;
    this.loadedAt = now;

    fetchVoltage(hass, phases, start, SLOTS)
      .then((slots) => {
        if (this.loadedKey === key) {
          this.slots = slots;
        }
      })
      .catch(() => {
        this.loadedAt = 0;
      });
  }
}
