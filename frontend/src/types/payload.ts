export type SlotState = 'on' | 'off' | 'possible' | 'unknown';

export type DayStatus = 'schedule' | 'no_outages' | 'waiting' | 'emergency';

export type PowerStatus =
  | 'power_on'
  | 'scheduled_outage'
  | 'possible_outage'
  | 'emergency'
  | 'unscheduled_outage'
  | 'unknown';

export type RegionStatus =
  'normal' | 'shortage' | 'outage_schedules' | 'emergency_outages' | 'grid_damage' | 'unknown';

export interface ScheduledOutage {
  readonly start: string;
  readonly end: string;
  readonly possible: boolean;
}

export interface ActualOutage {
  readonly start: string;
  readonly end: string | null;
  readonly hours: number;
}

export interface QueueDay {
  readonly date: string;
  readonly start: string;
  readonly status: DayStatus;
  readonly slots: readonly SlotState[];
  readonly planned?: readonly SlotState[];
  readonly updated_at: string | null;
  readonly versions: number;
  readonly outage_hours: number | null;
  readonly possible_hours: number | null;
  readonly longest_hours: number | null;
  readonly actual: readonly ActualOutage[];
  readonly actual_hours: number | null;
}

export interface QueueInfo {
  readonly title: string;
  readonly region: string;
  readonly operator: string;
  readonly group: string;
  readonly has_schedule: boolean;
  readonly grid_entity: string | null;
}

export interface RegionInfo {
  readonly status: RegionStatus;
  readonly since: string | null;
  readonly period_end: string | null;
}

export interface SourceInfo {
  readonly name: string | null;
  readonly ok: boolean;
  readonly last_success: string | null;
  readonly last_error: string | null;
  readonly fetched_at: string | null;
}

export interface GridInfo {
  readonly present: boolean | null;
  readonly since: string | null;
}

export interface QueueSummary {
  readonly days: number;
  readonly actual_hours: number | null;
  readonly count: number | null;
  readonly longest: ActualOutage | null;
  readonly availability: number | null;
}

export interface WorstDay {
  readonly date: string;
  readonly hours: number;
}

export interface QueueRecords {
  readonly longest_outage: ActualOutage | null;
  readonly worst_day: WorstDay | null;
  readonly longest_power_streak: ActualOutage | null;
  readonly current_power_streak: ActualOutage | null;
  readonly count: number;
}

export interface QueuePayload {
  readonly queue: QueueInfo;
  readonly now: string;
  readonly slot_minutes: number;
  readonly status: PowerStatus;
  readonly emergency: boolean;
  readonly region_status: RegionInfo | null;
  readonly current: ScheduledOutage | null;
  readonly next: ScheduledOutage | null;
  readonly next_possible: ScheduledOutage | null;
  readonly next_power_on: string | null;
  readonly grid: GridInfo | null;
  readonly source: SourceInfo;
  readonly days: readonly QueueDay[];
  readonly summary: QueueSummary;
  readonly records: QueueRecords | null;
}
