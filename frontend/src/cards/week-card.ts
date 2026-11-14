import { css, html, nothing, type TemplateResult } from 'lit';

import { WEEK_CARD_TYPE } from '../const';
import { batteryEntities, readBattery, runtimeMs, socAt } from '../data/battery';
import { HOUR_MS, outageWindows, toPercent } from '../data/timeline';
import { barStyles } from '../styles';
import type { WeekCardConfig } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import type { QueueDay } from '../types/payload';
import { BlackoutBaseCard, type RenderContext } from './base-card';
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

const DEFAULT_DAYS = 7;
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
    return Math.min(90, Math.max(1, this.config?.days ?? DEFAULT_DAYS));
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

    return html`${config?.show_stats === false || !hasGrid ? nothing : html`<div class="summary">${renderStats(this.summary(ctx))}</div>`}
      <div class="rows">
        ${days.map((day) => this.renderRow(ctx, day, day.date === todayKey, hasGrid))}
      </div>
      <div class="axis-line mono">
        ${AXIS.map((hour) => html`<span style="left:${(hour / 24) * 100}%">${String(hour).padStart(2, '0')}</span>`)}
      </div>
      ${config?.show_legend === false ? nothing : this.renderLegend(ctx, hasGrid)}
      ${config?.show_next === false ? nothing : this.renderNext(ctx)}`;
  }

  private renderRow(
    ctx: RenderContext,
    day: QueueDay,
    isToday: boolean,
    hasGrid: boolean,
  ): TemplateResult {
    const { now, f } = ctx;
    const from = Date.parse(day.start);
    const to = from + 24 * HOUR_MS;
    const segments: BarSegment[] = [];
    const showSchedule = this.config?.show_schedule !== false;

    if (hasGrid) {
      segments.push({ from, to: Math.min(to, now), className: 'fill-on' });
      segments.push(
        ...day.actual.map((outage) => ({
          from: Date.parse(outage.start),
          to: outage.end ? Date.parse(outage.end) : now,
          className: 'fill-actual',
        })),
      );
    }

    if (showSchedule && day.status !== 'waiting') {
      for (const window of outageWindows(day)) {
        const start = hasGrid ? Math.max(window.start, now) : window.start;

        if (window.end > start) {
          segments.push({
            from: start,
            to: window.end,
            className: hasGrid ? 'fill-hatch' : window.possible ? 'fill-possible' : 'fill-actual',
          });
        }
      }
    }

    const marker = isToday
      ? html`<span class="now" style="left:${toPercent(now, from, to)}%"></span>`
      : undefined;

    return html`<div class="row ${isToday ? 'today' : ''}">
      <span class="row-label">${f.weekday(day.start)}</span>${renderBar(segments, from, to, marker)}
    </div>`;
  }

  private renderLegend(ctx: RenderContext, hasGrid: boolean): TemplateResult {
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
