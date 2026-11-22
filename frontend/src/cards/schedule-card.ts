import { css, html, nothing, type TemplateResult } from 'lit';

import { SCHEDULE_CARD_TYPE } from '../const';
import { batteryEntities, readBattery, socAt, type BatteryState } from '../data/battery';
import { isPublished, isRemoved, outageWindows, SLOT_MS, toPercent } from '../data/timeline';
import { DEFAULT_SCHEDULE_DAYS } from '../defaults';
import type { DayKey, ScheduleCardConfig } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import type { QueueDay, SlotState } from '../types/payload';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import type { SizeSetting } from './size';
import { describeSlot, type BarHover } from './hover';
import { findDay, hoursParts, renderStats, text, windowText, type StatView } from './parts';
import { findQueueEntity } from './stub';

const DAY_OFFSETS: Readonly<Record<DayKey, number>> = { today: 0, tomorrow: 1 };
const AXIS = [0, 6, 12, 18, 24];
const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

export class BlackoutScheduleCard extends BlackoutBaseCard<ScheduleCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    css`
      .source {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin: -6px 0 14px;
        color: var(--bo-muted);
        font-size: 12px;
      }

      .source span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .indicator {
        display: inline-flex;
        flex: none;
        align-items: center;
        gap: 6px;
        color: var(--tone);
      }

      .indicator::before {
        content: '';
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: currentColor;
      }

      .day {
        display: grid;
        grid-template-columns: 76px minmax(0, 1fr);
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .day-name {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .day-name strong {
        font-size: 13px;
        font-weight: 600;
      }

      .day-name span {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cells {
        position: relative;
        display: grid;
        grid-template-columns: repeat(24, minmax(0, 1fr));
        gap: 3px;
        height: 30px;
      }

      .cell {
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        border-radius: 3px;
      }

      .cell span {
        min-width: 0;
      }

      .cells .overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--bo-muted);
        font-size: 12px;
        pointer-events: none;
      }

      .cells .now {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 2px;
        border-radius: 1px;
        background: var(--bo-text);
        transform: translateX(-1px);
        pointer-events: none;
      }

      .axis {
        position: relative;
        height: 14px;
        margin: 4px 0 12px calc(76px + 12px);
      }

      .axis span {
        position: absolute;
        color: var(--bo-faint);
        font-size: 10px;
        transform: translateX(-50%);
      }

      .axis span:first-child {
        transform: none;
      }

      .axis span:last-child {
        transform: translateX(-100%);
      }

      .windows {
        display: flex;
        flex-direction: column;
        margin-top: 4px;
      }

      .window {
        display: grid;
        grid-template-columns: 12px minmax(0, 1fr) auto;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-top: 1px solid var(--bo-divider);
      }

      .window-main {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
      }

      .window-title {
        overflow: hidden;
        font-size: 14px;
        font-weight: 600;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .window-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .window-total {
        color: var(--bo-text);
        font-family: var(--bo-mono);
        font-size: 13px;
        font-weight: 600;
      }

      .marker {
        width: 10px;
        height: 10px;
        border-radius: 2px;
      }

      .marker.empty {
        border: 1px solid var(--bo-faint);
        background: transparent;
      }

      .legend {
        margin-bottom: 4px;
      }
    `,
  ];

  protected readonly cardSize = 5;

  protected override defaultSize(): SizeSetting {
    return this.config?.show_windows === false && this.config.show_totals === false
      ? 'small'
      : 'medium';
  }

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): ScheduleCardConfig {
    return { type: `custom:${SCHEDULE_CARD_TYPE}`, entity: findQueueEntity(hass) };
  }

  protected override extraEntities(): readonly string[] {
    return batteryEntities(this.config?.battery);
  }

  protected defaultTitle(ctx: RenderContext): string {
    return ctx.t('title.schedule');
  }

  protected headerSide(ctx: RenderContext): TemplateResult {
    return html`<span class="badge plain mono"
      >${ctx.t('schedule.queue', { group: ctx.payload.queue.group })}</span
    >`;
  }

  private dayKeys(): readonly DayKey[] {
    const days = this.config?.days;

    return days && days.length > 0 ? days : DEFAULT_SCHEDULE_DAYS;
  }

  protected renderContent(ctx: RenderContext): TemplateResult {
    const config = this.config;
    const battery = this.hass ? readBattery(this.hass, config?.battery) : null;
    const days = this.dayKeys().map((key) => ({ key, day: findDay(ctx, DAY_OFFSETS[key]) }));
    const states = new Set<string>(
      days.flatMap(({ day }) => (isPublished(day) ? [...day.slots] : ['unknown'])),
    );
    const removed = days.some(
      ({ day }) => isPublished(day) && day.slots.some((_, index) => isRemoved(day, index)),
    );

    const small = ctx.size === 'small';

    return html`${config?.show_source === false ? nothing : this.renderSource(ctx)}
      ${days.map(({ key, day }) => this.renderDay(ctx, key, day))}
      <div class="axis mono">
        ${AXIS.map((hour) => html`<span style="left:${(hour / 24) * 100}%">${String(hour).padStart(2, '0')}</span>`)}
      </div>
      ${config?.show_legend === false ? nothing : this.renderLegend(ctx, states, removed)}
      ${
        config?.show_windows === false || small
          ? nothing
          : html`<div class="windows" data-drop="4">
              ${days.map(({ key, day }) => this.renderWindows(ctx, key, day, battery))}
            </div>`
      }
      ${
        config?.show_totals === false || small
          ? nothing
          : html`<div class="foot" data-drop="3">
              <div class="divider"></div>
              ${renderStats(this.totals(ctx, ctx.size === 'medium'), ctx.size === 'medium')}
            </div>`
      }`;
  }

  private renderSource(ctx: RenderContext): TemplateResult {
    const { payload, now, t, f } = ctx;
    const source = payload.source.name ?? payload.queue.operator;
    const updated = payload.source.last_success
      ? t('schedule.source_updated', { source, ago: f.relative(payload.source.last_success, now) })
      : source;

    return html`<div class="source" data-drop="2">
      <span>${updated}</span>
      <span class="indicator tone-${payload.emergency ? 'emergency' : 'on'}"
        >${t(payload.emergency ? 'schedule.emergency_active' : 'schedule.emergency_none')}</span
      >
    </div>`;
  }

  private renderDay(ctx: RenderContext, key: DayKey, day: QueueDay | undefined): TemplateResult {
    const { now, t, f } = ctx;
    const published = isPublished(day);
    const slots: readonly SlotState[] = published ? day.slots : [];
    const showNow = key === 'today' && this.config?.show_now !== false && day;
    const nowPercent = day
      ? toPercent(now, Date.parse(day.start), Date.parse(day.start) + 24 * 3_600_000)
      : 0;
    const hover = day ? this.cellsHover(ctx, day) : undefined;

    return html`<div class="day">
      <div class="day-name">
        <strong>${t(`day.${key}`)}</strong>
        <span>${day ? f.dayDate(day.start) : ''}</span>
      </div>
      <div
        class="cells"
        @pointermove=${hover?.move}
        @pointerdown=${hover?.move}
        @pointerleave=${hover?.leave}
      >
        ${HOURS.map(
          (hour) =>
            html`<div class="cell">
              <span
                class="fill-${this.cellState(day, slots, hour * 2)}"
                data-slot=${hour * 2}
              ></span>
              <span
                class="fill-${this.cellState(day, slots, hour * 2 + 1)}"
                data-slot=${hour * 2 + 1}
              ></span>
            </div>`,
        )}
        ${published ? nothing : html`<span class="overlay">${t('schedule.not_published')}</span>`}
        ${showNow ? html`<span class="now" style="left:${nowPercent}%"></span>` : nothing}
      </div>
    </div>`;
  }

  private cellsHover(ctx: RenderContext, day: QueueDay): BarHover {
    const start = Date.parse(day.start);

    return {
      move: (event) => {
        const target = event.target instanceof Element ? event.target.closest('[data-slot]') : null;

        if (!(target instanceof HTMLElement)) {
          return;
        }

        const slot = start + Number(target.dataset.slot) * SLOT_MS;

        this.showHover(
          target.getBoundingClientRect(),
          describeSlot(ctx, slot, { title: windowText(ctx.f, slot, slot + SLOT_MS), grid: false }),
        );
      },
      leave: this.hideHover,
    };
  }

  private cellState(day: QueueDay | undefined, slots: readonly SlotState[], index: number): string {
    const state = slots[index] ?? 'unknown';

    return day && state !== 'unknown' && isRemoved(day, index) ? 'skipped' : state;
  }

  private renderLegend(
    ctx: RenderContext,
    states: ReadonlySet<string>,
    removed: boolean,
  ): TemplateResult {
    const items: readonly SlotState[] = ['on', 'off', 'possible', 'unknown'];

    return html`<div class="legend" data-drop="1">
      ${items
        .filter((state) => state === 'on' || state === 'off' || states.has(state))
        .map(
          (state) =>
            html`<span class="legend-item"
              ><span class="swatch ${state}"></span>${ctx.t(`legend.${state}`)}</span
            >`,
        )}
      ${
        removed
          ? html`<span class="legend-item"
              ><span class="swatch skipped"></span>${ctx.t('legend.removed')}</span
            >`
          : nothing
      }
    </div>`;
  }

  private renderWindows(
    ctx: RenderContext,
    key: DayKey,
    day: QueueDay | undefined,
    battery: BatteryState | null,
  ): TemplateResult {
    const { now, t, f } = ctx;
    const label = t(`day.${key}`);

    if (!isPublished(day)) {
      return html`<div class="window">
        <span class="marker empty"></span>
        <div class="window-main">
          <span class="window-title">${label}</span>
          <span class="window-note">${t('schedule.not_published')}</span>
        </div>
        <span class="window-total muted">${t('value.none')}</span>
      </div>`;
    }

    const all = outageWindows(day).filter((window) => !window.possible);
    const remaining = all.filter((window) => window.end > now);
    const windows = remaining.length > 0 ? remaining : all;

    if (all.length === 0) {
      return html`<div class="window">
        <span class="marker fill-on"></span>
        <div class="window-main">
          <span class="window-title">${label}</span>
          <span class="window-note">${t('schedule.no_outages')}</span>
        </div>
        <span class="window-total">${f.number(0)} ${t('unit.hours')}</span>
      </div>`;
    }

    const upcoming = windows.find((window) => window.end > now);
    const notes: string[] = [];

    if (upcoming && upcoming.start > now) {
      notes.push(t('schedule.in', { duration: f.duration(upcoming.start - now) }));

      if (battery) {
        notes.push(
          t('schedule.battery_at', {
            time: f.time(upcoming.start),
            soc: f.number(
              socAt(battery, upcoming.start, now, this.changeUntil(ctx, upcoming.start)),
              0,
            ),
          }),
        );
      }
    } else if (upcoming) {
      notes.push(t('schedule.now'));
    } else {
      notes.push(t('schedule.passed'));
    }

    return html`<div class="window">
      <span class="marker fill-off"></span>
      <div class="window-main">
        <span class="window-title"
          >${label} ·
          <span class="mono"
            >${windows.map((window) => windowText(f, window.start, window.end)).join(', ')}</span
          ></span
        >
        <span class="window-note">${notes.join(' · ')}</span>
      </div>
      <span class="window-total">${f.number(day.outage_hours ?? 0, 0)} ${t('unit.hours')}</span>
    </div>`;
  }

  private changeUntil(ctx: RenderContext, start: number): number {
    const { status, next_power_on: powerBack } = ctx.payload;
    const outageNow =
      status === 'scheduled_outage' || status === 'unscheduled_outage' || status === 'emergency';

    return outageNow && powerBack ? Date.parse(powerBack) : start;
  }

  private totals(ctx: RenderContext, short = false): StatView[] {
    const { t, f } = ctx;
    const today = findDay(ctx, 0);
    const tomorrow = findDay(ctx, 1);

    return [
      {
        label: t(short ? 'stat.today' : 'stat.without_power_today'),
        parts: hoursParts(f, isPublished(today) ? today.outage_hours : null),
      },
      {
        label: t('stat.longest'),
        parts: hoursParts(f, isPublished(today) ? today.longest_hours : null),
      },
      {
        label: t(short ? 'stat.tomorrow' : 'stat.without_power_tomorrow'),
        parts: isPublished(tomorrow) ? hoursParts(f, tomorrow.outage_hours) : text(t('value.none')),
      },
    ];
  }
}
