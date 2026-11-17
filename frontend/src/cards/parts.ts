import { html, nothing, type TemplateResult } from 'lit';

import { HOUR_MS, toPercent, type Segment } from '../data/timeline';
import type { PowerStatus, QueueDay } from '../types/payload';
import type { DurationPart, Formatter } from '../utils/format';
import type { RenderContext } from './base-card';
import type { BarHover } from './hover';

export type Tone = 'on' | 'off' | 'possible' | 'emergency' | 'muted';

export interface StatView {
  readonly label: string;
  readonly parts: readonly DurationPart[];
  readonly tone?: Tone;
  readonly note?: string;
}

export const STATUS_TONES: Readonly<Record<PowerStatus, Tone>> = {
  power_on: 'on',
  scheduled_outage: 'off',
  possible_outage: 'possible',
  emergency: 'emergency',
  unscheduled_outage: 'off',
  unknown: 'muted',
};

export function text(value: string): DurationPart[] {
  return [{ value, unit: '' }];
}

export function valueParts(parts: readonly DurationPart[]): TemplateResult {
  return html`${parts.map(
    (part) =>
      html`<span class="mono">${part.value}</span>${
          part.unit ? html`<span class="unit">${part.unit}</span>` : nothing
        } `,
  )}`;
}

export function renderBadge(
  label: string,
  tone: Tone,
  solid = false,
  icon?: string,
): TemplateResult {
  return html`<span class="badge tone-${tone} ${solid ? 'solid' : ''}"
    >${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : nothing}${label}</span
  >`;
}

export function renderStats(
  stats: readonly StatView[],
  row = false,
): TemplateResult | typeof nothing {
  if (stats.length === 0) {
    return nothing;
  }

  return html`<div
    class="stats ${row ? 'one-row' : ''}"
    style="--stat-columns: ${Math.min(stats.length, 4)}"
  >
    ${stats.map(
      (stat) =>
        html`<div class="stat">
          <span class="stat-label">${stat.label}</span>
          <span class="stat-value ${stat.tone ? `tone-${stat.tone}` : ''}"
            >${valueParts(stat.parts)}</span
          >${stat.note ? html`<span class="stat-note">${stat.note}</span>` : nothing}
        </div>`,
    )}
  </div>`;
}

export function hoursParts(
  f: Formatter,
  hours: number | null | undefined,
  decimals = 1,
): DurationPart[] {
  if (hours === null || hours === undefined) {
    return text(f.translator.t('value.none'));
  }

  return [{ value: f.number(hours, decimals), unit: f.translator.t('unit.hours') }];
}

export function durationFromHours(f: Formatter, hours: number | null | undefined): DurationPart[] {
  if (hours === null || hours === undefined) {
    return text(f.translator.t('value.none'));
  }

  return f.durationParts(hours * HOUR_MS);
}

export function windowText(f: Formatter, start: number | string, end: number | string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const endText =
    f.dayKey(endDate) !== f.dayKey(startDate) && f.time(endDate) === '00:00'
      ? '24:00'
      : f.time(endDate);

  return `${f.time(startDate)}–${endText}`;
}

export interface BarSegment {
  readonly from: number;
  readonly to: number;
  readonly className: string;
}

export function renderBar(
  segments: readonly BarSegment[],
  from: number,
  to: number,
  extra?: TemplateResult,
  hover?: BarHover,
): TemplateResult {
  return html`<div
    class="bar ${hover ? 'hoverable' : ''}"
    @pointermove=${hover?.move}
    @pointerdown=${hover?.move}
    @pointerleave=${hover?.leave}
  >
    ${segments.map((segment) => {
      const left = toPercent(segment.from, from, to);
      const width = toPercent(segment.to, from, to) - left;

      return width > 0
        ? html`<span class="seg ${segment.className}" style="left:${left}%;width:${width}%"></span>`
        : nothing;
    })}
    ${extra ?? nothing}
  </div>`;
}

export function slotClass(segment: Segment, now: number): string {
  const future = segment.start >= now ? 'future' : '';

  return `fill-${segment.state} ${segment.state === 'off' || segment.state === 'possible' ? future : ''}`;
}

export function dayLabel(ctx: RenderContext, day: QueueDay, index: number): string {
  const todayKey = ctx.f.dayKey(new Date(ctx.now));

  if (day.date === todayKey) {
    return ctx.t('day.today');
  }

  return index >= 0 && day.date > todayKey ? ctx.t('day.tomorrow') : ctx.f.weekday(day.start);
}

export function findDay(ctx: RenderContext, offset: number): QueueDay | undefined {
  const key = ctx.f.dayKey(new Date(ctx.now + offset * 24 * HOUR_MS));

  return ctx.payload.days.find((day) => day.date === key);
}
