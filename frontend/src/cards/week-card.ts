import { css, html, nothing, type TemplateResult } from 'lit';

import { WEEK_CARD_TYPE } from '../const';
import { batteryEntities, readBattery, runtimeMs, socAt } from '../data/battery';
import { HOUR_MS, outageWindows, SLOT_MS, toPercent } from '../data/timeline';
import { DEFAULT_WEEK_DAYS } from '../defaults';
import { barStyles } from '../styles';
import type { WeekCardConfig } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import type { QueueDay } from '../types/payload';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import { describeSlot } from './hover';
import {
  renderBadge,
  renderBar,
  renderStats,
  text,
  windowText,
  type BarSegment,
  type StatView,
} from './parts';
import { findQueueEntity } from './stub';

const AXIS = [0, 6, 12, 18, 24];

export class BlackoutWeekCard extends BlackoutBaseCard<WeekCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    barStyles,
    css`
      .summary {
        margin-bottom: 16px;
      }

      .summary .stat-value {
        font-size: 18px;
      }

      .rows .row {
        --row-label-width: 44px;
        --bar-height: 12px;
      }

      .rows .row-label {
        font-family: var(--bo-mono);
        font-size: 11px;
      }

      .rows .row.today .row-label {
        color: var(--bo-text);
        font-weight: 700;
      }

      .axis-line {
        position: relative;
        height: 14px;
        margin: 6px 0 0 calc(44px + 10px);
      }

      .axis-line span {
        position: absolute;
        color: var(--bo-faint);
        font-size: 10px;
        transform: translateX(-50%);
      }

      .axis-line span:first-child {
        transform: none;
      }

      .axis-line span:last-child {
        transform: translateX(-100%);
      }

      .legend {
        margin-top: 12px;
      }

      .next {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-top: 16px;
        padding: 14px 16px;
        border-radius: 12px;
        background: var(--bo-surface);
      }

      .next-block {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }

      .next-label {
        color: var(--bo-muted);
        font-size: 11px;
      }

      .next-value {
        color: var(--tone, var(--bo-text));
        font-family: var(--bo-mono);
        font-size: 20px;
        font-weight: 700;
        white-space: nowrap;
      }

      .next-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];

  protected readonly cardSize = 6;

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): WeekCardConfig {
    return { type: `custom:${WEEK_CARD_TYPE}`, entity: findQueueEntity(hass) };
  }

  protected override historyDays(): number {
    return Math.min(90, Math.max(1, this.config?.days ?? DEFAULT_WEEK_DAYS));
  }

  protected override extraEntities(): readonly string[] {
    return batteryEntities(this.config?.battery);
  }

  protected defaultTitle(ctx: RenderContext): string {
    return ctx.t('title.week', { days: this.translator.plural('unit.days', this.historyDays()) });
  }

  protected headerSide(ctx: RenderContext): TemplateResult | typeof nothing {
    const grid = ctx.payload.grid;

    if (this.config?.show_badge === false || !grid || grid.present === null) {
      return nothing;
    }

    return renderBadge(
      ctx.t(grid.present ? 'week.grid_on' : 'week.grid_off'),
      grid.present ? 'on' : 'off',
    );
  }

  protected renderContent(ctx: RenderContext): TemplateResult {
    const config = this.config;
    const todayKey = ctx.f.dayKey(new Date(ctx.now));
    const days = ctx.payload.days.filter((day) => day.date <= todayKey).slice(-this.historyDays());
    const hasGrid = ctx.payload.grid !== null;
    const rows = days.map((day) => ({ day, segments: this.rowSegments(ctx, day, hasGrid) }));
    const skipped = rows.some((row) =>
      row.segments.some((item) => item.className === 'fill-skipped'),
    );

    return html`${config?.show_stats === false || !hasGrid ? nothing : html`<div class="summary">${renderStats(this.summary(ctx))}</div>`}
      <div class="rows">
        ${rows.map((row) => this.renderRow(ctx, row.day, row.segments, row.day.date === todayKey, hasGrid))}
      </div>
      <div class="axis-line mono">
        ${AXIS.map((hour) => html`<span style="left:${(hour / 24) * 100}%">${String(hour).padStart(2, '0')}</span>`)}
      </div>
      ${config?.show_legend === false ? nothing : this.renderLegend(ctx, hasGrid, skipped)}
      ${config?.show_next === false ? nothing : this.renderNext(ctx)}`;
  }

  private rowSegments(ctx: RenderContext, day: QueueDay, hasGrid: boolean): BarSegment[] {
    const { now } = ctx;
    const from = Date.parse(day.start);
    const to = from + 24 * HOUR_MS;
    const showSchedule = this.config?.show_schedule !== false;
    const windows = showSchedule && day.status !== 'waiting' ? outageWindows(day) : [];

    if (!hasGrid) {
      return windows.map((window) => ({
        from: window.start,
        to: window.end,
        className: window.possible ? 'fill-possible' : 'fill-actual',
      }));
    }

    const skipped = windows
      .filter((window) => !window.possible && window.start < now)
      .map((window) => ({
        from: window.start,
        to: Math.min(window.end, now),
        className: 'fill-skipped',
      }));
    const actual = day.actual.map((outage) => ({
      from: Date.parse(outage.start),
      to: outage.end ? Date.parse(outage.end) : now,
      className: 'fill-actual',
    }));
    const planned = windows
      .filter((window) => window.end > now)
      .map((window) => ({
        from: Math.max(window.start, now),
        to: window.end,
        className: 'fill-hatch',
      }));

    return [
      { from, to: Math.min(to, now), className: 'fill-on' },
      ...skipped,
      ...actual,
      ...planned,
    ];
  }

  private renderRow(
    ctx: RenderContext,
    day: QueueDay,
    segments: readonly BarSegment[],
    isToday: boolean,
    hasGrid: boolean,
  ): TemplateResult {
    const { now, f } = ctx;
    const from = Date.parse(day.start);
    const to = from + 24 * HOUR_MS;
    const showSchedule = this.config?.show_schedule !== false;
    const marker = isToday
      ? html`<span class="now" style="left:${toPercent(now, from, to)}%"></span>`
      : undefined;
    const hover = this.barHover(from, to, (slot) =>
      describeSlot(ctx, slot, {
        title: `${f.weekday(slot)} · ${windowText(f, slot, slot + SLOT_MS)}`,
        schedule: showSchedule || !hasGrid,
      }),
    );

    return html`<div class="row ${isToday ? 'today' : ''}">
      <span class="row-label">${f.weekday(day.start)}</span>${renderBar(
        segments,
        from,
        to,
        marker,
        hover,
      )}
    </div>`;
  }

  private renderLegend(ctx: RenderContext, hasGrid: boolean, skipped: boolean): TemplateResult {
    const { t } = ctx;

    return html`<div class="legend">
      ${hasGrid ? html`<span class="legend-item"><span class="swatch on"></span>${t('legend.grid_on')}</span>` : nothing}
      <span class="legend-item"><span class="swatch off"></span>${t('legend.off')}</span>
      ${
        hasGrid && this.config?.show_schedule !== false
          ? html`<span class="legend-item"
              ><span class="swatch hatch"></span>${t('legend.by_schedule')}</span
            >`
          : nothing
      }
      ${
        skipped
          ? html`<span class="legend-item"
              ><span class="swatch skipped"></span>${t('legend.skipped')}</span
            >`
          : nothing
      }
    </div>`;
  }

  private summary(ctx: RenderContext): StatView[] {
    const { payload, t, f } = ctx;
    const summary = payload.summary;
    const longest = summary.longest;

    return [
      {
        label: t('stat.without_grid'),
        parts:
          summary.actual_hours === null
            ? text(t('value.none'))
            : f.durationParts(summary.actual_hours * HOUR_MS),
      },
      { label: t('stat.outages'), parts: text(String(summary.count ?? 0)) },
      {
        label: t('stat.longest'),
        parts: longest ? f.durationParts(longest.hours * HOUR_MS) : text(t('value.none')),
      },
      {
        label: t('stat.availability'),
        parts:
          summary.availability === null
            ? text(t('value.none'))
            : [{ value: f.number(summary.availability, 1), unit: t('unit.percent') }],
      },
    ];
  }

  private renderNext(ctx: RenderContext): TemplateResult {
    const { payload, now, t, f } = ctx;
    const next = payload.next;
    const battery = this.hass ? readBattery(this.hass, this.config?.battery) : null;

    if (!next) {
      return html`<div class="next">
        <div class="next-block">
          <span class="next-label">${t('week.next_by_schedule')}</span>
          <span class="next-value muted">${t('week.no_next')}</span>
        </div>
      </div>`;
    }

    const start = Date.parse(next.start);
    const end = Date.parse(next.end);
    const outageNow =
      payload.status === 'scheduled_outage' ||
      payload.status === 'unscheduled_outage' ||
      payload.status === 'emergency';
    const changeUntil =
      outageNow && payload.next_power_on ? Date.parse(payload.next_power_on) : start;
    const soc = battery ? socAt(battery, start, now, changeUntil) : null;
    const runtime = battery && soc !== null ? runtimeMs(battery, soc) : null;
    const enough = runtime === null || start + runtime >= end;

    return html`<div class="next">
      <div class="next-block">
        <span class="next-label">${t('week.next_by_schedule')}</span>
        <span class="next-value">${windowText(f, start, end)}</span>
        <span class="next-note"
          >${t('week.next_meta', { duration: f.duration(Math.max(0, start - now)), group: payload.queue.group })}</span
        >
      </div>
      ${
        battery && soc !== null
          ? html`<div class="next-block">
              <span class="next-label">${t('week.battery_forecast', { time: f.time(start) })}</span>
              <span class="next-value tone-${enough ? 'on' : 'possible'}"
                >${enough ? '✓' : '!'} ${f.number(soc, 0)} %</span
              >
              <span class="next-note"
                >${runtime === null ? '' : t('week.battery_lasts', { duration: f.duration(runtime) })}</span
              >
            </div>`
          : nothing
      }
    </div>`;
  }
}
