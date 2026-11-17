import { html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { QueueController } from '../data/queue-controller';
import { SLOT_MS, toPercent } from '../data/timeline';
import { createTranslator, type TranslationParams, type Translator } from '../i18n';
import { cardStyles, tokens } from '../styles';
import type { BaseCardConfig, ColorKey } from '../types/config';
import type { HomeAssistant, LovelaceGridOptions } from '../types/ha';
import type { QueuePayload } from '../types/payload';
import { createFormatter, DEFAULT_TIME_ZONE, type Formatter } from '../utils/format';
import { SIZE_RANGES } from '../defaults';
import { slotAt, type BarHover, type HoverContent } from './hover';
import {
  clampSize,
  gridRows,
  isSizeSetting,
  rowsCardSize,
  rowsHeight,
  SIZE_ROWS,
  sizeRows,
  tierOf,
  type CardSize,
  type SizeSetting,
} from './size';

const COLOR_VARIABLES: Readonly<Record<ColorKey, string>> = {
  on: '--blackout-on-color',
  off: '--blackout-off-color',
  possible: '--blackout-possible-color',
  emergency: '--blackout-emergency-color',
  battery: '--blackout-battery-color',
  unknown: '--blackout-unknown-color',
};

export interface RenderContext {
  readonly payload: QueuePayload;
  readonly now: number;
  readonly t: Translator['t'];
  readonly f: Formatter;
  readonly size: SizeSetting;
}

interface HoverBand {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

interface HoverView {
  readonly band: HoverBand;
  readonly align: 'start' | 'center' | 'end';
  readonly content: HoverContent;
}

const TOUCH_HOVER_MS = 2500;

const overflows = (card: HTMLElement): boolean => card.scrollHeight > card.clientHeight + 1;

const setCut = (group: readonly HTMLElement[], cut: boolean): void => {
  group.forEach((element) => {
    element.toggleAttribute('data-cut', cut);
  });
};

const dropGroups = (card: HTMLElement): HTMLElement[][] => {
  const groups = new Map<number, HTMLElement[]>();

  card.querySelectorAll<HTMLElement>('[data-drop]').forEach((element) => {
    const priority = Number(element.dataset.drop) || 0;

    groups.set(priority, [...(groups.get(priority) ?? []), element]);
  });

  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([, elements]) => elements);
};

export abstract class BlackoutBaseCard<C extends BaseCardConfig> extends LitElement {
  static override styles = [tokens, cardStyles];

  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() protected accessor config: C | undefined;

  @state() private accessor hover: HoverView | null = null;

  @property({ attribute: false }) accessor layout: string | undefined;

  protected readonly queue = new QueueController(this);
  protected translator: Translator = createTranslator('en');
  protected formatter: Formatter = createFormatter(this.translator);
  private localeKey = '';
  private hoverTimer: number | undefined;
  private resizeObserver: ResizeObserver | undefined;

  protected abstract readonly cardSize: number;

  protected abstract renderContent(ctx: RenderContext): TemplateResult;

  protected abstract defaultTitle(ctx: RenderContext): string;

  protected historyDays(): number {
    return 1;
  }

  protected extraEntities(): readonly string[] {
    return [];
  }

  protected abstract headerSide(ctx: RenderContext): TemplateResult | typeof nothing;

  protected requiresEntity(): boolean {
    return true;
  }

  protected defaultSize(): SizeSetting {
    return 'medium';
  }

  setConfig(config: C): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }

    this.config = config;
  }

  getCardSize(): number {
    const rows = this.heightRows();

    return rows === undefined ? this.cardSize : rowsCardSize(rows);
  }

  getGridOptions(): LovelaceGridOptions {
    const [min, max] = this.sizeRange();

    return {
      columns: 12,
      rows: this.heightRows() ?? 'auto',
      min_columns: 6,
      min_rows: SIZE_ROWS[min],
      max_rows: SIZE_ROWS[max],
    };
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver ??= new ResizeObserver(() => {
      this.fitHeight();
    });
    this.resizeObserver.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
  }

  protected override updated(changed: PropertyValues<this>): void {
    super.updated(changed);

    const rows = this.layout === 'grid' ? undefined : this.heightRows();

    if (rows === undefined) {
      this.style.removeProperty('height');
    } else {
      this.style.height = `${rowsHeight(rows)}px`;
    }

    this.fitHeight();
  }

  protected size(): SizeSetting {
    return tierOf(this.heightRows());
  }

  protected cardClass(): string {
    return this.heightRows() === undefined ? '' : 'fixed';
  }

  private sizeRange(): readonly [CardSize, CardSize] {
    const type = (this.config?.type ?? '').replace(/^custom:/, '');

    return SIZE_RANGES[type] ?? ['small', 'large'];
  }

  private chosenSize(): SizeSetting {
    const config = this.config;
    const [min, max] = this.sizeRange();
    const chosen = config && isSizeSetting(config.size) ? config.size : this.defaultSize();

    return clampSize(chosen, min, max);
  }

  private heightRows(): number | undefined {
    const config = this.config;

    return (config ? gridRows(config) : undefined) ?? sizeRows(this.chosenSize());
  }

  private fitHeight(): void {
    const card = this.renderRoot.querySelector<HTMLElement>('ha-card');

    if (!card) {
      return;
    }

    card.querySelectorAll('[data-cut]').forEach((element) => {
      element.removeAttribute('data-cut');
    });

    if (this.heightRows() === undefined || card.clientHeight === 0) {
      return;
    }

    const cut: HTMLElement[][] = [];

    for (const group of dropGroups(card)) {
      if (!overflows(card)) {
        break;
      }

      setCut(group, true);
      cut.push(group);
    }

    cut
      .slice(0, -1)
      .reverse()
      .forEach((group) => {
        setCut(group, false);

        if (overflows(card)) {
          setCut(group, true);
        }
      });
  }

  protected override shouldUpdate(changed: PropertyValues<this>): boolean {
    if (changed.size !== 1 || !changed.has('hass')) {
      return true;
    }

    const previous = changed.get('hass');

    if (!previous || !this.hass || !this.config) {
      return true;
    }

    const watched = [this.config.entity, ...this.extraEntities()].filter(
      (id): id is string => typeof id === 'string',
    );

    return watched.some((id) => previous.states[id] !== this.hass?.states[id]);
  }

  protected override willUpdate(): void {
    if (!this.hass || !this.config) {
      return;
    }

    const language = this.config.language ?? this.hass.locale?.language ?? this.hass.language;
    const timeZone = this.config.time_zone ?? DEFAULT_TIME_ZONE;
    const key = `${language}|${timeZone}|${JSON.stringify(this.config.labels ?? {})}`;

    if (key !== this.localeKey) {
      this.localeKey = key;
      this.translator = createTranslator(language, this.config.labels ?? {});
      this.formatter = createFormatter(this.translator, timeZone);
    }

    if (this.requiresEntity() || this.config.entity) {
      this.queue.sync(this.hass, this.config.entity, this.historyDays());
    }
  }

  protected t(key: string, params?: TranslationParams): string {
    return this.translator.t(key, params);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const style = styleMap(this.colorStyles(this.config));
    const message = this.renderState();

    if (message) {
      return html`<ha-card class=${this.cardClass()} style=${style}>${message}</ha-card>`;
    }

    const payload = this.queue.payload;

    if (!payload) {
      return this.renderWithoutQueue(style);
    }

    const ctx: RenderContext = {
      payload,
      now: this.queue.now,
      t: (key, params) => this.translator.t(key, params),
      f: this.formatter,
      size: this.size(),
    };

    return html`<ha-card class=${this.cardClass()} style=${style}
      >${this.renderHeader(ctx)}${this.renderContent(ctx)}${this.renderHover()}</ha-card
    >`;
  }

  private renderHover(): TemplateResult | typeof nothing {
    const hover = this.hover;

    if (!hover) {
      return nothing;
    }

    const { band, align, content } = hover;

    return html`<span
        class="hover-band"
        style=${styleMap({
          left: `${band.left}px`,
          top: `${band.top}px`,
          width: `${band.width}px`,
          height: `${band.height}px`,
        })}
      ></span>
      <div
        class="hover-tip ${align}"
        style=${styleMap({ left: `${band.left + band.width / 2}px`, top: `${band.top}px` })}
      >
        <div class="hover-title">${content.title}</div>
        ${content.lines.map(
          (line) =>
            html`<div class="hover-line">
              <span class="swatch ${line.swatch}"></span><span>${line.text}</span>
            </div>`,
        )}
      </div>`;
  }

  protected showHover(target: DOMRectReadOnly, content: HoverContent): void {
    const card = this.renderRoot.querySelector('ha-card')?.getBoundingClientRect();

    if (!card || target.width <= 0) {
      return;
    }

    const band = {
      left: target.left - card.left,
      top: target.top - card.top,
      width: target.width,
      height: target.height,
    };
    const center = (band.left + band.width / 2) / card.width;
    const current = this.hover;

    window.clearTimeout(this.hoverTimer);

    if (
      current?.band.left === band.left &&
      current.band.top === band.top &&
      current.content.title === content.title
    ) {
      return;
    }

    this.hover = {
      band,
      align: center < 0.25 ? 'start' : center > 0.75 ? 'end' : 'center',
      content,
    };
  }

  protected readonly hideHover = (event: PointerEvent): void => {
    window.clearTimeout(this.hoverTimer);

    if (event.pointerType === 'touch') {
      this.hoverTimer = window.setTimeout(() => {
        this.hover = null;
      }, TOUCH_HOVER_MS);

      return;
    }

    this.hover = null;
  };

  protected barHover(from: number, to: number, describe: (slot: number) => HoverContent): BarHover {
    return {
      move: (event) => {
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

        if (rect.width <= 0) {
          return;
        }

        const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.9999);
        const slot = Math.max(from, slotAt(from + ratio * (to - from)));
        const end = Math.min(to, slot + SLOT_MS);
        const left = rect.left + (toPercent(slot, from, to) / 100) * rect.width;
        const right = rect.left + (toPercent(end, from, to) / 100) * rect.width;

        this.showHover(new DOMRect(left, rect.top, right - left, rect.height), describe(slot));
      },
      leave: this.hideHover,
    };
  }

  protected renderWithoutQueue(style: ReturnType<typeof styleMap>): TemplateResult {
    return html`<ha-card class=${this.cardClass()} style=${style}
      ><div class="message">${this.t('error.loading')}</div></ha-card
    >`;
  }

  private renderState(): TemplateResult | undefined {
    if (!this.requiresEntity() && !this.config?.entity) {
      return undefined;
    }

    const error = this.queue.error;

    if (!error) {
      return undefined;
    }

    if (error === 'failed' && this.queue.payload) {
      return undefined;
    }

    return html`<div class="message error">${this.t(`error.${error}`)}</div>`;
  }

  protected renderHeader(ctx: RenderContext): TemplateResult | typeof nothing {
    if (this.config?.show_header === false) {
      return nothing;
    }

    const title = this.config?.title ?? this.defaultTitle(ctx);
    const clickable = this.config?.tap_action !== 'none' && Boolean(this.config?.entity);

    return html`<div
      class="header ${clickable ? 'clickable' : ''}"
      @click=${clickable ? this.openMoreInfo : undefined}
    >
      <div class="title">${title}</div>
      <div class="header-side">${this.headerSide(ctx)}</div>
    </div>`;
  }

  protected queueTitle(ctx: RenderContext): string {
    return `${ctx.t('title.power')} · ${ctx.t('title.queue', { group: ctx.payload.queue.group })}`;
  }

  private colorStyles(config: C): Record<string, string> {
    const styles: Record<string, string> = {};

    for (const [key, value] of Object.entries(config.colors ?? {})) {
      const variable = COLOR_VARIABLES[key as ColorKey];

      if (variable && typeof value === 'string') {
        styles[variable] = value;
      }
    }

    return styles;
  }

  private readonly openMoreInfo = (): void => {
    const entityId = this.config?.entity;

    if (!entityId) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('hass-more-info', { detail: { entityId }, bubbles: true, composed: true }),
    );
  };
}
