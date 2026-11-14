import { css, html, nothing, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { RECORDS_CARD_TYPE } from '../const';
import {
  statisticRecord,
  streakRecord,
  type StatisticRecord,
  type StreakRecord,
} from '../data/statistics';
import { HOUR_MS } from '../data/timeline';
import type {
  OutageRecordItem,
  RecordItem,
  RecordsCardConfig,
  StatisticRecordItem,
} from '../types/config';
import type { HomeAssistant } from '../types/ha';
import type { ActualOutage } from '../types/payload';
import type { DurationPart, Formatter } from '../utils/format';
import { BlackoutBaseCard, type RenderContext } from './base-card';
import { text, valueParts } from './parts';
import { findQueueEntity } from './stub';

const REFRESH_MS = 10 * 60_000;

const DEFAULT_ITEMS: readonly RecordItem[] = [
  { type: 'longest_outage' },
  { type: 'longest_power_streak' },
  { type: 'worst_day' },
  { type: 'outage_count' },
];

const OUTAGE_ICONS: Readonly<Record<OutageRecordItem['type'], string>> = {
  longest_outage: 'mdi:transmission-tower-off',
  longest_power_streak: 'mdi:check-circle-outline',
  current_power_streak: 'mdi:timer-outline',
  worst_day: 'mdi:calendar-alert',
  outage_count: 'mdi:counter',
};

const OUTAGE_COLORS: Readonly<Record<OutageRecordItem['type'], string>> = {
  longest_outage: 'var(--bo-off)',
  longest_power_streak: 'var(--bo-on)',
  current_power_streak: 'var(--bo-on)',
  worst_day: 'var(--bo-off)',
  outage_count: 'var(--bo-muted)',
};

interface Tile {
  readonly label: string;
  readonly icon: string;
  readonly color: string;
  readonly parts: readonly DurationPart[];
  readonly note: string;
}

type Loaded = StatisticRecord | StreakRecord | null;

export class BlackoutRecordsCard extends BlackoutBaseCard<RecordsCardConfig> {
  static override styles = [
    ...BlackoutBaseCard.styles,
    css`
      .tiles {
        display: grid;
        grid-template-columns: repeat(var(--record-columns, 2), minmax(0, 1fr));
        gap: 10px;
      }

      .tile {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
        padding: 14px;
        border-radius: 12px;
        background: var(--bo-surface);
      }

      .tile-head {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--bo-muted);
        font-size: 12px;
      }

      .tile-head span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .tile-head ha-icon {
        --mdc-icon-size: 16px;
        flex: none;
      }

      .tile-value {
        font-size: 24px;
        font-weight: 700;
        white-space: nowrap;
      }

      .tile-value .unit {
        font-size: 12px;
      }

      .tile-note {
        overflow: hidden;
        color: var(--bo-muted);
        font-size: 11px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @container (max-width: 320px) {
        .tiles {
          grid-template-columns: minmax(0, 1fr);
        }
      }
    `,
  ];

  protected readonly cardSize = 5;

  @state() private accessor loaded: ReadonlyMap<number, Loaded> = new Map();
  private loadedKey = '';
  private loadedAt = 0;

  static getConfigElement(): HTMLElement {
    return document.createElement('blackout-card-editor');
  }

  static getStubConfig(hass: HomeAssistant): RecordsCardConfig {
    return { type: `custom:${RECORDS_CARD_TYPE}`, entity: findQueueEntity(hass) };
  }

  protected override requiresEntity(): boolean {
    return this.items().some((item) => item.type !== 'statistic' && item.type !== 'streak');
  }

  protected defaultTitle(ctx: RenderContext): string {
    return ctx.t('title.records');
  }

  protected headerSide(): TemplateResult | typeof nothing {
    return this.config?.since ? html`<span>${this.config.since}</span>` : nothing;
  }

  private items(): readonly RecordItem[] {
    return this.config?.items && this.config.items.length > 0 ? this.config.items : DEFAULT_ITEMS;
  }

  protected override updated(): void {
    this.loadStatistics();
  }

  protected override renderWithoutQueue(style: ReturnType<typeof styleMap>): TemplateResult {
    if (this.requiresEntity()) {
      return super.renderWithoutQueue(style);
    }

    const ctx = { t: this.translator.t, f: this.formatter, now: Date.now() };

    return html`<ha-card style=${style}>
      ${
        this.config?.show_header === false
          ? nothing
          : html`<div class="header">
              <div class="title">${this.config?.title ?? ctx.t('title.records')}</div>
              <div class="header-side">${this.headerSide()}</div>
            </div>`
      }
      ${this.renderTiles(this.items().map((item, index) => this.tile(item, index, ctx.f, null)))}
    </ha-card>`;
  }

  protected renderContent(ctx: RenderContext): TemplateResult {
    return this.renderTiles(this.items().map((item, index) => this.tile(item, index, ctx.f, ctx)));
  }

  private renderTiles(tiles: readonly Tile[]): TemplateResult {
    const columns = this.config?.columns ?? 2;

    return html`<div class="tiles" style=${styleMap({ '--record-columns': String(columns) })}>
      ${tiles.map(
        (tile) =>
          html`<div class="tile">
            <div class="tile-head">
              <ha-icon .icon=${tile.icon} style=${styleMap({ color: tile.color })}></ha-icon
              ><span>${tile.label}</span>
            </div>
            <div class="tile-value">${valueParts(tile.parts)}</div>
            <div class="tile-note">${tile.note}</div>
          </div>`,
      )}
    </div>`;
  }

  private tile(item: RecordItem, index: number, f: Formatter, ctx: RenderContext | null): Tile {
    const t = this.translator.t;

    if (item.type === 'statistic') {
      return this.statisticTile(
        item,
        this.loaded.get(index) as StatisticRecord | null | undefined,
        f,
      );
    }

    if (item.type === 'streak') {
      const record = this.loaded.get(index) as StreakRecord | null | undefined;

      return {
        label: item.label ?? t('records.streak'),
        icon: item.icon ?? 'mdi:check-circle-outline',
        color: item.color ?? 'var(--bo-on)',
        parts: record
          ? text(this.translator.plural('unit.days', record.days))
          : text(t('value.none')),
        note: record
          ? `${f.shortDate(record.start)} – ${f.shortDate(record.end)}`
          : t('records.no_data'),
      };
    }

    return this.outageTile(item, f, ctx);
  }

  private outageTile(item: OutageRecordItem, f: Formatter, ctx: RenderContext | null): Tile {
    const t = this.translator.t;
    const records = ctx?.payload.records ?? null;
    const base = {
      label: item.label ?? t(`records.${item.type}`),
      icon: item.icon ?? OUTAGE_ICONS[item.type],
      color: item.color ?? OUTAGE_COLORS[item.type],
    };
    const empty: Tile = { ...base, parts: text(t('value.none')), note: t('records.no_data') };

    if (!records) {
      return empty;
    }

    if (item.type === 'outage_count') {
      return { ...base, parts: text(String(records.count)), note: '' };
    }

    if (item.type === 'worst_day') {
      return records.worst_day
        ? {
            ...base,
            parts: f.durationParts(records.worst_day.hours * HOUR_MS),
            note: f.date(records.worst_day.date),
          }
        : empty;
    }

    const outage: ActualOutage | null = records[item.type];

    return outage
      ? { ...base, parts: f.durationParts(outage.hours * HOUR_MS), note: f.date(outage.start) }
      : empty;
  }

  private statisticTile(
    item: StatisticRecordItem,
    record: StatisticRecord | null | undefined,
    f: Formatter,
  ): Tile {
    const t = this.translator.t;
    const entity = this.hass?.states[item.entity];
    const label = item.label ?? entity?.attributes.friendly_name ?? t('records.statistic');
    const icon = item.icon ?? 'mdi:trophy-outline';
    const color = item.color ?? 'var(--bo-possible)';

    if (!record) {
      return { label, icon, color, parts: text(t('value.none')), note: t('records.no_data') };
    }

    const unit = item.unit ?? entity?.attributes.unit_of_measurement ?? '';
    const value = record.value * (item.scale ?? 1);
    const format = item.date_format ?? this.dateFormat(item);
    const note =
      format === 'datetime'
        ? f.dateTime(record.start)
        : format === 'month'
          ? f.month(record.start)
          : f.date(record.start);

    return {
      label,
      icon,
      color,
      parts: [{ value: f.number(value, item.decimals ?? 1), unit }],
      note,
    };
  }

  private dateFormat(item: StatisticRecordItem): 'datetime' | 'day' | 'month' {
    const period = item.period ?? 'day';

    if (period === 'month') {
      return 'month';
    }

    return period === 'hour' || period === '5minute' ? 'datetime' : 'day';
  }

  private loadStatistics(): void {
    const hass = this.hass;
    const items = this.items();
    const key = JSON.stringify(items);

    if (!hass || (key === this.loadedKey && Date.now() - this.loadedAt < REFRESH_MS)) {
      return;
    }

    this.loadedKey = key;
    this.loadedAt = Date.now();
    const timeZone = this.formatter.timeZone;
    const jobs = items.map((item, index) => {
      if (item.type === 'statistic') {
        return statisticRecord(hass, item, timeZone).then((record) => [index, record] as const);
      }

      if (item.type === 'streak') {
        return streakRecord(hass, item).then((record) => [index, record] as const);
      }

      return Promise.resolve(undefined);
    });

    Promise.all(jobs.map((job) => job.catch(() => undefined))).then((results) => {
      const loaded = new Map<number, Loaded>();

      for (const result of results) {
        if (result) {
          loaded.set(result[0], result[1]);
        }
      }

      this.loaded = loaded;
    });
  }
}
