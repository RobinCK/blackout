import { SLOT_MS, slotSegments } from '../data/timeline';
import type { SlotState } from '../types/payload';
import type { RenderContext } from './base-card';
import { windowText } from './parts';

export interface HoverLine {
  readonly swatch: string;
  readonly text: string;
}

export interface HoverContent {
  readonly title: string;
  readonly lines: readonly HoverLine[];
}

export interface BarHover {
  readonly move: (event: PointerEvent) => void;
  readonly leave: (event: PointerEvent) => void;
}

export interface SlotOptions {
  readonly title: string;
  readonly grid?: boolean;
  readonly schedule?: boolean;
  readonly emergency?: boolean;
}

export function slotAt(moment: number): number {
  return Math.floor(moment / SLOT_MS) * SLOT_MS;
}

function capitalize(value: string): string {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function gridLine(ctx: RenderContext, from: number, to: number): HoverLine | null {
  const { payload, now, t, f } = ctx;

  if (!payload.queue.grid_entity || from >= now) {
    return null;
  }

  const outage = payload.days
    .flatMap((day) => day.actual)
    .map((item) => ({
      start: Date.parse(item.start),
      end: item.end ? Date.parse(item.end) : now,
    }))
    .find((item) => item.start < to && item.end > from);

  if (!outage) {
    return { swatch: 'on', text: `${t('row.grid')}: ${t('legend.on')}` };
  }

  return {
    swatch: 'off',
    text: `${t('row.grid')}: ${t('hover.no_power')} · ${windowText(f, outage.start, outage.end)}`,
  };
}

function emergencyLine(ctx: RenderContext, to: number): HoverLine | null {
  return ctx.payload.status === 'emergency' && to > ctx.now
    ? { swatch: 'hatch', text: ctx.t('status.emergency') }
    : null;
}

function scheduleLine(
  ctx: RenderContext,
  slot: number,
  prefix: boolean,
  optional: boolean,
): HoverLine | null {
  const { payload, t, f } = ctx;
  const segment = slotSegments(payload.days).find((item) => item.start <= slot && slot < item.end);
  const state: SlotState = segment?.state ?? 'unknown';

  if (state === 'unknown' && optional) {
    return null;
  }

  const range =
    segment && state !== 'unknown' ? ` · ${windowText(f, segment.start, segment.end)}` : '';
  const label = t(`legend.${state}`);

  return {
    swatch: state,
    text: prefix ? `${t('hover.schedule')}: ${label}${range}` : `${capitalize(label)}${range}`,
  };
}

export function describeSlot(ctx: RenderContext, slot: number, options: SlotOptions): HoverContent {
  const end = slot + SLOT_MS;
  const grid = options.grid !== false;
  const lines = [
    grid ? gridLine(ctx, slot, end) : null,
    options.emergency ? emergencyLine(ctx, end) : null,
  ].filter((line): line is HoverLine => line !== null);

  if (options.schedule === false) {
    return { title: options.title, lines };
  }

  const prefix = lines.length > 0 || (grid && Boolean(ctx.payload.queue.grid_entity));
  const schedule = scheduleLine(ctx, slot, prefix, lines.length > 0);

  return { title: options.title, lines: schedule ? [...lines, schedule] : lines };
}
