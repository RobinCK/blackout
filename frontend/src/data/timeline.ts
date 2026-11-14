import type { QueueDay, SlotState } from '../types/payload';

export const SLOT_MS = 30 * 60_000;
export const HOUR_MS = 60 * 60_000;

export interface Segment {
  readonly start: number;
  readonly end: number;
  readonly state: SlotState;
}

export interface Window {
  readonly start: number;
  readonly end: number;
  readonly possible: boolean;
}

export function dayStart(day: QueueDay): number {
  return Date.parse(day.start);
}

export function slotSegments(days: readonly QueueDay[]): Segment[] {
  const segments: Segment[] = [];

  for (const day of days) {
    const start = dayStart(day);

    day.slots.forEach((state, index) => {
      const slotStart = start + index * SLOT_MS;
      const previous = segments.at(-1);

      if (previous && previous.state === state && previous.end === slotStart) {
        segments[segments.length - 1] = { ...previous, end: slotStart + SLOT_MS };

        return;
      }

      segments.push({ start: slotStart, end: slotStart + SLOT_MS, state });
    });
  }

  return segments;
}

export function clipSegments(segments: readonly Segment[], from: number, to: number): Segment[] {
  return segments
    .filter((segment) => segment.end > from && segment.start < to)
    .map((segment) => ({
      ...segment,
      start: Math.max(segment.start, from),
      end: Math.min(segment.end, to),
    }));
}

export function outageWindows(day: QueueDay): Window[] {
  return slotSegments([day])
    .filter((segment) => segment.state === 'off' || segment.state === 'possible')
    .map((segment) => ({
      start: segment.start,
      end: segment.end,
      possible: segment.state === 'possible',
    }));
}

export function stateAt(days: readonly QueueDay[], moment: number): SlotState {
  const segment = slotSegments(days).find((s) => s.start <= moment && moment < s.end);

  return segment?.state ?? 'unknown';
}

export function isPublished(day: QueueDay | undefined): day is QueueDay {
  return day !== undefined && day.status !== 'waiting';
}

export function toPercent(value: number, from: number, to: number): number {
  return Math.min(100, Math.max(0, ((value - from) / (to - from)) * 100));
}
