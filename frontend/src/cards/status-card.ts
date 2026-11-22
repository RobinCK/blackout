import { css, html, nothing, type TemplateResult } from 'lit';

import { STATUS_CARD_TYPE } from '../const';
import {
  allowedLoadKw,
  batteryEntities,
  readBattery,
  runtimeMs,
  socAt,
  type BatteryState,
} from '../data/battery';
import {
  clipSegments,
  HOUR_MS,
  plannedDay,
  SLOT_MS,
  slotSegments,
  toPercent,
} from '../data/timeline';
import { DEFAULT_TIMELINE_HOURS, DEFAULT_TIMELINE_OFFSET } from '../defaults';
import { barStyles } from '../styles';
import type { StatGroup, StatKey, StatusCardConfig } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import type { ActualOutage } from '../types/payload';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import { describeSlot } from './hover';
import {
  durationFromHours,
  findDay,
  hoursParts,
  renderBadge,
  renderBar,
  renderStats,
  slotClass,
  STATUS_TONES,
  text,
  windowText,
  type BarSegment,
  type StatView,
  type Tone,
} from './parts';
import { findQueueEntity } from './stub';

const LONG_LABEL_LIMIT = 35;

const DEFAULT_STATS: Readonly<Record<StatGroup, readonly StatKey[]>> = {
  power_on: ['today', 'longest', 'tomorrow', 'emergency'],
  outage: ['today', 'longest', 'tomorrow', 'emergency'],
  emergency: ['today', 'tomorrow', 'region', 'emergency'],
};

const BATTERY_STATS: Readonly<Record<StatGroup, readonly StatKey[]>> = {
  power_on: ['today', 'longest', 'tomorrow', 'emergency'],
  outage: ['load', 'battery_reserve', 'today', 'emergency'],
  emergency: ['load', 'battery_reserve', 'until_morning', 'emergency'],
};

interface Hero {
  readonly label: string;
  readonly parts: ReturnType<RenderContext['f']['durationParts']>;
  readonly tone: Tone;
  readonly side: string;
  readonly note: string;
}

interface BatteryForecast {
  readonly from: number;
  readonly until: number | null;
  readonly soc: number;
  readonly enough: boolean;
  readonly label: string;
  readonly short: string;
}

export class BlackoutStatusCard extends BlackoutBaseCard<StatusCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    barStyles,
    css`
      .hero {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 12px;
      }

      .hero-label {
        color: var(--bo-muted);
        font-size: 12px;
        line-height: 16px;
      }

      .hero-value {
        color: var(--tone);
        font-family: var(--bo-mono);
        font-size: 40px;
        font-weight: 600;
        line-height: 46px;
        white-space: nowrap;
      }

      .hero-value .unit {
        margin: 0 6px 0 2px;
        font-size: 13px;
        line-height: 1;
      }

      .hero > div:first-child {
        flex: none;
      }

      .hero-side {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 4px;
        min-width: 0;
        padding-bottom: 6px;
        text-align: right;
      }

      .hero-window {
        color: var(--bo-text);
        font-family: var(--bo-mono);
        font-size: 16px;
        font-weight: 600;
        white-space: nowrap;
      }

      .hero-note {
        max-width: 100%;
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .timeline {
        margin-top: 16px;
      }

      .hero.small .hero-value {
        font-size: 30px;
        line-height: 34px;
      }

      .timeline.small {
        --row-gap: 6px;
        margin-top: 10px;
      }

      .timeline.medium {
        --bar-height: 18px;
        --row-gap: 10px;
        margin-top: 18px;
      }
    `,
  ];

  protected readonly cardSize = 4;

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): StatusCardConfig {
    return { type: `custom:${STATUS_CARD_TYPE}`, entity: findQueueEntity(hass) };
  }

  protected override historyDays(): number {
    return this.statKeys('power_on').includes('availability') ? 7 : 1;
  }

  protected override extraEntities(): readonly string[] {
    return batteryEntities(this.config?.battery);
  }

  protected defaultTitle(ctx: RenderContext): string {
    return this.queueTitle(ctx);
  }

  protected headerSide(ctx: RenderContext): TemplateResult | typeof nothing {
    if (this.config?.show_badge === false) {
      return nothing;
    }

    const status = ctx.payload.status;
    const emergency = status === 'emergency';

    return renderBadge(
      ctx.t(`status.${status}`),
      STATUS_TONES[status],
      emergency,
      emergency ? 'mdi:alert-outline' : undefined,
    );
  }

  protected renderContent(ctx: RenderContext): TemplateResult {
    const config = this.config ?? ({ type: STATUS_CARD_TYPE } as StatusCardConfig);
    const battery = this.hass ? readBattery(this.hass, config.battery) : null;
    const hero = this.hero(ctx);
    const group = this.group(ctx);
    const stats = config.show_stats === false ? [] : this.stats(ctx, group, battery);

    const size = ctx.size;
    const footer =
      stats.length > 0 && size !== 'small'
        ? html`<div class="foot">
            <div class="divider"></div>
            ${renderStats(stats)}
          </div>`
        : nothing;

    return html`<div class="hero ${size}">
        <div>
          <div class="hero-label">${hero.label}</div>
          <div class="hero-value tone-${hero.tone}">
            ${hero.parts.map(
              (part) =>
                html`${part.value}${part.unit ? html`<span class="unit">${part.unit}</span>` : nothing}`,
            )}
          </div>
        </div>
        <div class="hero-side">
          ${hero.side ? html`<span class="hero-window">${hero.side}</span>` : nothing}
          ${hero.note ? html`<span class="hero-note">${hero.note}</span>` : nothing}
        </div>
      </div>
      ${config.show_timeline === false ? nothing : this.renderTimeline(ctx, battery)} ${footer}`;
  }

  private group(ctx: RenderContext): StatGroup {
    const status = ctx.payload.status;

    if (status === 'emergency') {
      return 'emergency';
    }

    return status === 'scheduled_outage' || status === 'unscheduled_outage' ? 'outage' : 'power_on';
  }

  private outageSince(ctx: RenderContext): number | null {
    const { grid, region_status: region, current } = ctx.payload;

    if (grid?.present === false && grid.since) {
      return Date.parse(grid.since);
    }

    if (current) {
      return Date.parse(current.start);
    }

    return region?.since ? Date.parse(region.since) : null;
  }

  private hero(ctx: RenderContext): Hero {
    const { payload, now, t, f } = ctx;
    const updated = payload.source.last_success
      ? t('hero.updated', { ago: f.relative(payload.source.last_success, now) })
      : '';

    if (payload.status === 'scheduled_outage' && payload.next_power_on) {
      const back = Date.parse(payload.next_power_on);
      const start = payload.current ? Date.parse(payload.current.start) : now;

      return {
        label: t('hero.power_back_in'),
        parts: f.durationParts(back - now),
        tone: 'on',
        side: t('hero.at', { time: f.time(back) }),
        note: [
          t('hero.since_schedule', { time: f.time(start) }),
          t('hero.elapsed', { duration: f.duration(now - start) }),
        ].join(' · '),
      };
    }

    if (payload.status === 'emergency' || payload.status === 'unscheduled_outage') {
      const since = this.outageSince(ctx);
      const note =
        payload.status === 'emergency'
          ? [t('hero.schedule_suspended'), t('hero.restore_unknown')].join(' · ')
          : t('hero.outside_schedule');

      return {
        label: t('hero.no_power_for'),
        parts: since === null ? text(t('value.none')) : f.durationParts(now - since),
        tone: payload.status === 'emergency' ? 'emergency' : 'off',
        side: since === null ? '' : t('hero.since', { time: f.time(since) }),
        note,
      };
    }

    const next = payload.next ?? payload.next_possible;

    if (!next) {
      return {
        label: t('hero.no_outages'),
        parts: text(t('value.none')),
        tone: 'muted',
        side: '',
        note: payload.queue.has_schedule ? updated : t('hero.no_schedule'),
      };
    }

    const start = Date.parse(next.start);
    const end = Date.parse(next.end);

    return {
      label: t(next.possible ? 'hero.possible_in' : 'hero.outage_in'),
      parts: f.durationParts(start - now),
      tone: next.possible ? 'possible' : 'off',
      side: windowText(f, start, end),
      note: [t('hero.by_schedule', { duration: f.duration(end - start) }), updated]
        .filter(Boolean)
        .join(' · '),
    };
  }

  private forecast(ctx: RenderContext, battery: BatteryState): BatteryForecast {
    const { payload, now, t, f } = ctx;
    const outageNow =
      payload.status !== 'power_on' &&
      payload.status !== 'possible_outage' &&
      payload.status !== 'unknown';
    const powerBack =
      payload.next_power_on && payload.status !== 'emergency'
        ? Date.parse(payload.next_power_on)
        : null;
    const from = outageNow ? now : payload.next ? Date.parse(payload.next.start) : now;
    const end = outageNow ? powerBack : payload.next ? Date.parse(payload.next.end) : null;
    const soc = socAt(battery, from, now);
    const runtime = runtimeMs(battery, soc);
    const until = runtime === null ? null : from + runtime;
    const enough = until === null || (end !== null && until >= end);
    const socText = f.number(soc, 0);

    if (until === null) {
      return {
        from,
        until,
        soc,
        enough,
        label: t('battery.forecast_full', { soc: socText, time: f.time(from) }),
        short: `${socText} %`,
      };
    }

    const label = outageNow
      ? t('battery.forecast_now', { soc: socText, until: f.time(until) })
      : t('battery.forecast_at', { soc: socText, time: f.time(from), until: f.time(until) });
    const short = t('battery.forecast_short', { soc: socText, until: f.time(until) });

    return { from, until, soc, enough, label, short };
  }

  private forecastText(
    forecast: BatteryForecast,
    left: number,
    marker: TemplateResult,
  ): TemplateResult {
    const label = left > LONG_LABEL_LIMIT ? forecast.short : forecast.label;

    return html`<span class="bar-text" style="left:${left}%">${label}</span>${marker}`;
  }

  private renderTimeline(ctx: RenderContext, battery: BatteryState | null): TemplateResult {
    const { payload, now, t, f } = ctx;
    const hours = this.config?.timeline_hours ?? DEFAULT_TIMELINE_HOURS;
    const offset = this.config?.timeline_offset ?? DEFAULT_TIMELINE_OFFSET;
    const from = Math.floor((now - offset * HOUR_MS) / HOUR_MS) * HOUR_MS;
    const to = from + hours * HOUR_MS;
    const hasGrid = payload.grid !== null;
    const scheduled = (start: number, end: number): BarSegment[] =>
      clipSegments(slotSegments(payload.days), start, end).map((segment) => ({
        from: segment.start,
        to: segment.end,
        className: slotClass(segment, now),
      }));
    const planned = clipSegments(
      slotSegments(payload.days.map(plannedDay)),
      from,
      Math.min(now, to),
    ).map((segment) => ({
      from: segment.start,
      to: segment.end,
      className: segment.state === 'off' ? 'fill-skipped' : slotClass(segment, now),
    }));
    const segments: BarSegment[] = hasGrid
      ? [...planned, ...scheduled(Math.max(now, from), to)]
      : scheduled(from, to);

    segments.push(
      ...this.actualSegments(
        payload.days.flatMap((day) => day.actual),
        from,
        to,
        now,
      ),
    );

    if (payload.status === 'emergency') {
      const since = this.outageSince(ctx) ?? now;
      segments.push({ from: Math.max(since, from), to: now, className: 'fill-off' });
      segments.push({ from: now, to, className: 'fill-hatch' });
    }

    const nowMarker = html`<span class="now" style="left:${toPercent(now, from, to)}%"></span>`;
    const forecast = battery ? this.forecast(ctx, battery) : null;
    const ticks = this.ticks(from, to, hours);
    const hover = this.barHover(from, to, (slot) =>
      describeSlot(ctx, slot, { title: windowText(f, slot, slot + SLOT_MS), emergency: true }),
    );

    return html`<div class="timeline ${ctx.size}">
      <div class="row">
        <span class="row-label">${t('row.grid')}</span>${renderBar(
          segments,
          from,
          to,
          nowMarker,
          hover,
        )}
      </div>
      ${
        forecast
          ? html`<div class="row" data-drop="2">
              <span class="row-label">${t('row.battery')}</span>${renderBar(
                [
                  { from, to: forecast.from, className: 'fill-faint' },
                  {
                    from: forecast.from,
                    to: forecast.until ?? to,
                    className: forecast.enough ? 'fill-battery' : 'fill-battery-low',
                  },
                ],
                from,
                to,
                this.forecastText(forecast, toPercent(forecast.from, from, to), nowMarker),
                hover,
              )}
            </div>`
          : nothing
      }
      <div class="row axis" data-drop="1">
        <span class="row-label"></span>
        <div class="ticks">
          ${ticks.map((tick) => html`<span class="tick mono" style="left:${toPercent(tick, from, to)}%">${f.time(tick).slice(0, 2)}</span>`)}
        </div>
      </div>
    </div>`;
  }

  private actualSegments(
    outages: readonly ActualOutage[],
    from: number,
    to: number,
    now: number,
  ): BarSegment[] {
    return outages
      .map((outage) => ({
        from: Date.parse(outage.start),
        to: outage.end ? Date.parse(outage.end) : now,
        className: 'fill-actual',
      }))
      .filter((segment) => segment.to > from && segment.from < to);
  }

  private ticks(from: number, to: number, hours: number): number[] {
    const step = Math.max(1, Math.round(hours / 4)) * HOUR_MS;
    const ticks: number[] = [];

    for (let tick = from; tick <= to; tick += step) {
      ticks.push(tick);
    }

    return ticks;
  }

  private statKeys(group: StatGroup): readonly StatKey[] {
    const stats = this.config?.stats;
    const defaults = this.config?.battery?.soc ? BATTERY_STATS : DEFAULT_STATS;

    if (Array.isArray(stats)) {
      return stats;
    }

    const byGroup = stats as Readonly<Partial<Record<StatGroup, readonly StatKey[]>>> | undefined;

    return byGroup?.[group] ?? defaults[group];
  }

  private stats(ctx: RenderContext, group: StatGroup, battery: BatteryState | null): StatView[] {
    return this.statKeys(group)
      .map((key) => this.stat(ctx, key, battery))
      .filter((stat): stat is StatView => stat !== null);
  }

  private stat(ctx: RenderContext, key: StatKey, battery: BatteryState | null): StatView | null {
    const { payload, now, t, f } = ctx;
    const today = findDay(ctx, 0);
    const tomorrow = findDay(ctx, 1);

    switch (key) {
      case 'today':
        return { label: t('stat.today'), parts: hoursParts(f, today?.outage_hours) };
      case 'longest':
        return { label: t('stat.longest'), parts: hoursParts(f, today?.longest_hours) };
      case 'tomorrow':
        return {
          label: t('stat.tomorrow'),
          parts:
            tomorrow && tomorrow.status !== 'waiting'
              ? hoursParts(f, tomorrow.outage_hours)
              : text(t('value.not_yet')),
        };
      case 'emergency':
        return {
          label: t('stat.emergency'),
          parts: text(t(payload.emergency ? 'value.yes' : 'value.no')),
          tone: payload.emergency ? 'emergency' : 'on',
        };
      case 'region':
        return {
          label: t('stat.region'),
          parts: text(t(`region.${payload.region_status?.status ?? 'unknown'}`)),
        };
      case 'next_outage':
        return {
          label: t('stat.next_outage'),
          parts: text(payload.next ? f.time(payload.next.start) : t('value.none')),
        };
      case 'power_back':
        return {
          label: t('stat.power_back'),
          parts: text(payload.next_power_on ? f.time(payload.next_power_on) : t('value.none')),
        };
      case 'source':
        return { label: t('stat.source'), parts: text(payload.source.name ?? t('value.none')) };
      case 'actual_today':
        return today?.actual_hours === null || today?.actual_hours === undefined
          ? null
          : { label: t('stat.actual_today'), parts: durationFromHours(f, today.actual_hours) };
      case 'availability':
        return payload.summary.availability === null
          ? null
          : {
              label: t('stat.availability'),
              parts: [
                { value: f.number(payload.summary.availability, 1), unit: t('unit.percent') },
              ],
            };
      default:
        return this.batteryStat(ctx, key, battery, now);
    }
  }

  private batteryStat(
    ctx: RenderContext,
    key: StatKey,
    battery: BatteryState | null,
    now: number,
  ): StatView | null {
    const { payload, t, f } = ctx;

    if (!battery) {
      return null;
    }

    if (key === 'load') {
      return battery.loadW === null
        ? null
        : { label: t('stat.load'), parts: [f.power(battery.loadW)] };
    }

    if (key === 'battery_reserve') {
      const runtime = runtimeMs(battery);

      return {
        label: t('stat.battery_reserve'),
        parts: runtime === null ? text('∞') : f.durationParts(runtime),
        tone: 'on',
      };
    }

    if (key === 'battery_at_start') {
      if (!payload.next) {
        return null;
      }

      const start = Date.parse(payload.next.start);

      return {
        label: t('stat.battery_at_start', { time: f.time(start) }),
        parts: [{ value: f.number(socAt(battery, start, now), 0), unit: t('unit.percent') }],
        tone: 'on',
      };
    }

    if (key === 'until_morning') {
      const kw = allowedLoadKw(battery, this.morning(ctx, battery.morningHour), now);

      return kw === null
        ? null
        : {
            label: t('stat.until_morning'),
            parts: [{ value: `≤ ${f.number(kw, 2)}`, unit: t('unit.kw') }],
          };
    }

    return null;
  }

  private morning(ctx: RenderContext, hour: number): number {
    const { now, f } = ctx;
    const base = now - (now % HOUR_MS);

    for (let step = 1; step <= 48; step += 1) {
      const candidate = base + step * HOUR_MS;

      if (Number(f.time(candidate).slice(0, 2)) === hour) {
        return candidate;
      }
    }

    return now + 12 * HOUR_MS;
  }
}
