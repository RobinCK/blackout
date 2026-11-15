import { css, html, nothing, svg, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { BATTERY_CARD_TYPE } from '../const';
import { batteryEntities, readBattery, type BatteryState } from '../data/battery';
import { batteryDay, forecastDay, type BatteryForecast } from '../data/battery-day';
import { fetchNumericHistory, type Sample } from '../data/history';
import { HOUR_MS, outageWindows, toPercent, type Window } from '../data/timeline';
import type { BatteryCardConfig } from '../types/config';
import type { HassEntity, HomeAssistant } from '../types/ha';
import type { QueuePayload } from '../types/payload';
import { startOfDayIn, type Formatter } from '../utils/format';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import { renderBadge, renderStats, text, windowText, type StatView, type Tone } from './parts';
import { findQueueEntity } from './stub';

const REFRESH_MS = 5 * 60_000;
const DAY_MS = 24 * HOUR_MS;
const HEIGHT = 112;
const TOP = 8;
const IDLE_W = 30;
const AXIS = [0, 6, 12, 18, 24];
const OUTAGE_STATUSES = new Set(['scheduled_outage', 'emergency', 'unscheduled_outage']);

interface View {
  readonly now: number;
  readonly t: RenderContext['t'];
  readonly f: Formatter;
  readonly payload: QueuePayload | undefined;
}

interface Day {
  readonly start: number;
  readonly end: number;
}

const y = (soc: number): number => TOP + ((100 - soc) / 100) * (HEIGHT - TOP);

function merge(windows: readonly Window[]): Window[] {
  const sorted = [...windows].sort((a, b) => a.start - b.start);
  const merged: Window[] = [];

  for (const window of sorted) {
    const previous = merged.at(-1);

    if (previous && window.start <= previous.end) {
      merged[merged.length - 1] = { ...previous, end: Math.max(previous.end, window.end) };
      continue;
    }

    merged.push(window);
  }

  return merged;
}

function findSocEntity(hass: HomeAssistant): string | undefined {
  const batteries = Object.values(hass.states).filter(
    (entity: HassEntity) =>
      entity.entity_id.startsWith('sensor.') && entity.attributes.device_class === 'battery',
  );

  return (batteries.find((entity) => entity.entity_id.includes('soc')) ?? batteries.at(0))
    ?.entity_id;
}

export class BlackoutBatteryCard extends BlackoutBaseCard<BatteryCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    css`
      .chart {
        position: relative;
        height: ${HEIGHT}px;
      }

      .chart svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .band {
        position: absolute;
        top: 0;
        bottom: 0;
        background: var(--bo-hatch);
        opacity: 0.55;
      }

      .grid-line {
        position: absolute;
        right: 0;
        left: 0;
        border-top: 1px dashed var(--bo-divider);
      }

      .grid-line.reserve {
        border-top-color: color-mix(in srgb, var(--bo-off) 55%, transparent);
      }

      .grid-label {
        position: absolute;
        right: 0;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 9px;
        line-height: 12px;
        white-space: nowrap;
      }

      .grid-label.reserve,
      .band-label {
        color: var(--bo-off);
      }

      .band-label {
        position: absolute;
        top: 2px;
        margin-left: 4px;
        font-size: 9px;
        font-weight: 600;
        white-space: nowrap;
      }

      .now-line {
        position: absolute;
        top: 0;
        bottom: 0;
        border-left: 1px solid color-mix(in srgb, var(--bo-text) 35%, transparent);
      }

      .dot {
        position: absolute;
        width: 9px;
        height: 9px;
        margin: -4.5px 0 0 -4.5px;
        box-sizing: border-box;
        border: 2px solid var(--ha-card-background, var(--card-background-color, #fff));
        border-radius: 50%;
        background: var(--bo-battery);
      }

      .dot.hollow {
        width: 7px;
        height: 7px;
        margin: -3.5px 0 0 -3.5px;
        border-color: var(--bo-battery);
        background: var(--ha-card-background, var(--card-background-color, #fff));
      }

      .point-label {
        position: absolute;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
        line-height: 12px;
        white-space: nowrap;
      }

      .point-label.current {
        color: var(--bo-text);
        font-size: 11px;
        font-weight: 600;
      }

      .axis-labels {
        display: flex;
        justify-content: space-between;
        margin-top: 6px;
        color: var(--bo-muted);
        font-family: var(--bo-mono);
        font-size: 10px;
      }

      .legend {
        margin-top: 12px;
      }

      .swatch.line {
        width: 14px;
        height: 2px;
        border-radius: 1px;
        background: var(--bo-battery);
      }

      .swatch.dashed {
        width: 14px;
        height: 0;
        border-top: 2px dashed color-mix(in srgb, var(--bo-battery) 60%, transparent);
        background: none;
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

  @state() private accessor samples: readonly Sample[] = [];
  private loadedKey = '';
  private loadedAt = 0;

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): BatteryCardConfig {
    const soc = findSocEntity(hass);

    return {
      type: `custom:${BATTERY_CARD_TYPE}`,
      entity: findQueueEntity(hass),
      ...(soc ? { battery: { soc } } : {}),
    };
  }

  protected override requiresEntity(): boolean {
    return false;
  }

  protected override extraEntities(): readonly string[] {
    return batteryEntities(this.config?.battery);
  }

  protected defaultTitle(ctx: RenderContext): string {
    return ctx.t('title.battery');
  }

  protected headerSide(ctx: RenderContext): TemplateResult | typeof nothing {
    return this.badge(ctx);
  }

  protected override updated(): void {
    this.loadHistory();
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
    };

    return html`<ha-card style=${style}>
      ${
        this.config?.show_header === false
          ? nothing
          : html`<div class="header">
              <div class="title">${this.config?.title ?? view.t('title.battery')}</div>
              <div class="header-side">${this.badge(view)}</div>
            </div>`
      }
      ${this.renderBody(view)}
    </ha-card>`;
  }

  private day(view: View): Day {
    const key = view.f.dayKey(view.now);
    const today = view.payload?.days.find((day) => day.date === key);
    const start = today ? Date.parse(today.start) : startOfDayIn(view.now, view.f.timeZone);

    return { start, end: start + DAY_MS };
  }

  private currentSoc(): number | null {
    const id = this.config?.battery?.soc;
    const value = id ? Number.parseFloat(this.hass?.states[id]?.state ?? '') : Number.NaN;

    return Number.isFinite(value) ? value : null;
  }

  private badge(view: View): TemplateResult | typeof nothing {
    const soc = this.currentSoc();

    if (soc === null) {
      return nothing;
    }

    const power = this.batteryPower();
    const value = view.f.number(soc, 0);

    if (power === null) {
      return html`<span class="badge plain">${value} %</span>`;
    }

    const [key, tone]: [string, Tone] =
      Math.abs(power) < IDLE_W
        ? ['battery_card.idle', 'muted']
        : power < 0
          ? ['battery_card.charging', 'on']
          : ['battery_card.discharging', 'possible'];

    return renderBadge(view.t(key, { soc: value }), tone);
  }

  private batteryPower(): number | null {
    const battery = this.config?.battery;
    const entity = battery?.power ? this.hass?.states[battery.power] : undefined;
    const value = entity ? Number.parseFloat(entity.state) : Number.NaN;

    if (!entity || !Number.isFinite(value)) {
      return null;
    }

    const watts =
      entity.attributes.unit_of_measurement?.toLowerCase() === 'kw' ? value * 1000 : value;

    return battery?.power_positive === 'charge' ? -watts : watts;
  }

  private outages(view: View, day: Day): { shown: Window[]; ahead: Window[] } {
    const payload = view.payload;
    const today = payload?.days.find((item) => item.date === view.f.dayKey(view.now));

    if (!payload || !today) {
      return { shown: [], ahead: [] };
    }

    const scheduled = today.status === 'waiting' ? [] : outageWindows(today);
    const past = payload.grid
      ? today.actual.map((outage) => ({
          start: Date.parse(outage.start),
          end: outage.end ? Date.parse(outage.end) : view.now,
          possible: false,
        }))
      : scheduled.filter((window) => window.start < view.now);
    const ahead = scheduled
      .filter((window) => window.end > view.now)
      .map((window) => ({ ...window, start: Math.max(window.start, view.now) }));
    const current =
      OUTAGE_STATUSES.has(payload.status) && !ahead.some((window) => window.start <= view.now)
        ? [
            {
              start: view.now,
              end: payload.next_power_on ? Date.parse(payload.next_power_on) : day.end,
              possible: false,
            },
          ]
        : [];

    return { shown: merge([...past, ...current, ...ahead]), ahead: merge([...current, ...ahead]) };
  }

  private renderBody(view: View): TemplateResult {
    const config = this.config;
    const hass = this.hass;

    if (!config?.battery?.soc || !hass) {
      return html`<div class="message">${view.t('battery_card.configure')}</div>`;
    }

    const day = this.day(view);
    const soc = this.currentSoc();
    const samples = soc === null ? this.samples : [...this.samples, { time: view.now, value: soc }];
    const battery = readBattery(hass, config.battery);
    const { shown, ahead } = this.outages(view, day);
    const forecast = battery ? forecastDay(battery, view.now, day.end, ahead) : null;

    return html`${this.renderChart(view, day, samples, battery, shown, forecast)}
      <div class="axis-labels">
        ${AXIS.map((hour) => html`<span>${String(hour).padStart(2, '0')}</span>`)}
      </div>
      ${this.renderLegend(view, shown, forecast)} ${renderStats(this.stats(view, samples, battery))}`;
  }

  private renderChart(
    view: View,
    day: Day,
    samples: readonly Sample[],
    battery: BatteryState | null,
    outages: readonly Window[],
    forecast: BatteryForecast | null,
  ): TemplateResult {
    const { t, f } = view;
    const x = (time: number): number => toPercent(time, day.start, day.end);
    const fact = samples.filter((sample) => sample.time >= day.start);
    const line = fact.map((sample) => `${x(sample.time) * 10},${y(sample.value)}`).join(' L');
    const last = fact.at(-1);
    const min = batteryDay(fact, null).min;
    const reserve = battery?.reserve ?? this.config?.battery?.reserve;
    const ahead = forecast?.points.map((point) => `${x(point.time) * 10},${y(point.soc)}`);
    const first = outages.find((window) => window.end > view.now);

    return html`<div class="chart">
      ${outages.map(
        (window) =>
          html`<span
            class="band"
            style=${styleMap({ left: `${x(window.start)}%`, width: `${x(window.end) - x(window.start)}%` })}
          ></span>`,
      )}
      ${
        first
          ? html`<span class="band-label" style=${styleMap({ left: `${x(first.start)}%` })}
              >${t('battery_card.off')}</span
            >`
          : nothing
      }
      <span class="grid-line" style="top:${y(100)}px"></span>
      <span class="grid-line" style="top:${y(50)}px"></span>
      ${
        reserve === undefined
          ? nothing
          : html`<span class="grid-line reserve" style="top:${y(reserve)}px"></span
              ><span class="grid-label reserve" style="top:${y(reserve) - 14}px"
                >${t('battery_card.reserve', { value: f.number(reserve, 0) })}</span
              >`
      }
      <span class="grid-label" style="top:${y(100) + 2}px">100 %</span>
      <span class="grid-label" style="top:${y(50) - 14}px">50 %</span>
      <svg viewBox="0 0 1000 ${HEIGHT}" preserveAspectRatio="none" aria-hidden="true">
        ${
          line && last
            ? svg`<path d="M${line} L${x(last.time) * 10},${HEIGHT} L${x(fact[0]?.time ?? day.start) * 10},${HEIGHT} Z"
                fill="var(--bo-battery)" fill-opacity="0.12"></path>
              <path d="M${line}" fill="none" stroke="var(--bo-battery)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"></path>`
            : nothing
        }
        ${
          ahead && ahead.length > 1
            ? svg`<path d="M${ahead.join(' L')}" fill="none" stroke="var(--bo-battery)"
              stroke-opacity="0.6" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"
              vector-effect="non-scaling-stroke"></path>`
            : nothing
        }
      </svg>
      <span class="now-line" style="left:${x(view.now)}%"></span>
      ${
        min && last && min.time < last.time
          ? html`<span class="dot hollow" style="left:${x(min.time)}%;top:${y(min.value)}px"></span>
              ${this.pointLabel(
                x(min.time),
                y(min.value) + 6,
                `${f.number(min.value, 0)} % · ${f.time(min.time)}`,
              )}`
          : nothing
      }
      ${
        last
          ? html`<span class="dot" style="left:${x(last.time)}%;top:${y(last.value)}px"></span>
              ${this.pointLabel(
                x(last.time),
                y(last.value) - 18,
                `${f.number(last.value, 0)} %`,
                x(last.time) > 12,
                true,
              )}`
          : nothing
      }
      ${
        forecast?.full
          ? this.pointLabel(
              x(forecast.full),
              y(100) + 6,
              t('battery_card.full_at', { time: f.time(forecast.full) }),
            )
          : nothing
      }
    </div>`;
  }

  private pointLabel(
    left: number,
    top: number,
    label: string,
    before = false,
    current = false,
  ): TemplateResult {
    const side =
      before || left > 70 ? { right: `${100 - left + 1.5}%` } : { left: `${left + 1.5}%` };

    return html`<span
      class="point-label ${current ? 'current' : ''}"
      style=${styleMap({ ...side, top: `${Math.max(0, Math.min(HEIGHT - 12, top))}px` })}
      >${label}</span
    >`;
  }

  private renderLegend(
    view: View,
    outages: readonly Window[],
    forecast: BatteryForecast | null,
  ): TemplateResult {
    const { t, f } = view;
    const only = outages.length === 1 ? outages[0] : undefined;

    return html`<div class="legend">
      <span class="legend-item"><span class="swatch line"></span>${t('legend.fact')}</span>
      ${
        forecast
          ? html`<span class="legend-item"
              ><span class="swatch dashed"></span>${t('legend.forecast')}</span
            >`
          : nothing
      }
      ${
        outages.length > 0
          ? html`<span class="legend-item"
              ><span class="swatch hatch"></span>${
                only
                  ? t('legend.outage_window', { window: windowText(f, only.start, only.end) })
                  : t('legend.off')
              }</span
            >`
          : nothing
      }
    </div>`;
  }

  private stats(view: View, samples: readonly Sample[], battery: BatteryState | null): StatView[] {
    const { t, f } = view;
    const today = batteryDay(samples, battery?.capacityKwh ?? null);
    const energy = (value: number | null): StatView['parts'] =>
      value === null ? text(t('value.none')) : [{ value: f.number(value, 1), unit: t('unit.kwh') }];

    return [
      { label: t('stat.charged'), parts: energy(today.charged) },
      { label: t('stat.discharged'), parts: energy(today.discharged) },
      {
        label: t('stat.cycles'),
        parts: text(today.cycles === null ? t('value.none') : f.number(today.cycles, 2)),
      },
      {
        label: t('stat.min_soc'),
        parts: today.min
          ? [{ value: f.number(today.min.value, 0), unit: t('unit.percent') }]
          : text(t('value.none')),
      },
    ];
  }

  private loadHistory(): void {
    const hass = this.hass;
    const soc = this.config?.battery?.soc;

    if (!hass || !soc) {
      return;
    }

    const now = Date.now();
    const start = startOfDayIn(now, this.formatter.timeZone);
    const key = `${soc}|${start}`;

    if (key === this.loadedKey && now - this.loadedAt < REFRESH_MS) {
      return;
    }

    this.loadedKey = key;
    this.loadedAt = now;

    fetchNumericHistory(hass, soc, start, now)
      .then((samples) => {
        if (this.loadedKey === key) {
          this.samples = samples;
        }
      })
      .catch(() => {
        this.loadedAt = 0;
      });
  }
}
