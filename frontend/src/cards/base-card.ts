import { html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { QueueController } from '../data/queue-controller';
import { createTranslator, type TranslationParams, type Translator } from '../i18n';
import { cardStyles, tokens } from '../styles';
import type { BaseCardConfig, ColorKey } from '../types/config';
import type { HomeAssistant, LovelaceGridOptions } from '../types/ha';
import type { QueuePayload } from '../types/payload';
import { createFormatter, DEFAULT_TIME_ZONE, type Formatter } from '../utils/format';

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
}

export abstract class BlackoutBaseCard<C extends BaseCardConfig> extends LitElement {
  static override styles = [tokens, cardStyles];

  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() protected accessor config: C | undefined;

  protected readonly queue = new QueueController(this);
  protected translator: Translator = createTranslator('en');
  protected formatter: Formatter = createFormatter(this.translator);
  private localeKey = '';

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

  setConfig(config: C): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration');
    }

    this.config = config;
  }

  getCardSize(): number {
    return this.cardSize;
  }

  getGridOptions(): LovelaceGridOptions {
    return { columns: 12, rows: 'auto', min_columns: 6 };
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
      return html`<ha-card style=${style}>${message}</ha-card>`;
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
    };

    return html`<ha-card style=${style}
      >${this.renderHeader(ctx)}${this.renderContent(ctx)}</ha-card
    >`;
  }

  protected renderWithoutQueue(style: ReturnType<typeof styleMap>): TemplateResult {
    return html`<ha-card style=${style}
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
