import { html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

import { createTranslator, type Translator } from '../i18n';
import type { BaseCardConfig } from '../types/config';
import type { HomeAssistant } from '../types/ha';
import { loadHaComponents } from './load-ha-components';
import { schemaFor, type HaFormSchema } from './schema';

interface ValueChangedEvent extends Event {
  readonly detail: { readonly value: Record<string, unknown> };
}

function compact(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => {
      if (item === undefined || item === null || item === '') {
        return false;
      }

      return !(typeof item === 'object' && !Array.isArray(item) && Object.keys(item).length === 0);
    }),
  );
}

export class BlackoutCardEditor extends LitElement {
  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() private accessor config: BaseCardConfig | undefined;

  private translator: Translator = createTranslator('en');

  setConfig(config: BaseCardConfig): void {
    this.config = config;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void loadHaComponents().then(() => this.requestUpdate());
  }

  protected override willUpdate(): void {
    this.translator = createTranslator(this.hass?.locale?.language ?? this.hass?.language);
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this.config) {
      return nothing;
    }

    const t = (key: string): string => this.translator.t(key);
    const schema: readonly HaFormSchema[] = schemaFor(this.config.type, t);

    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${schema}
      .computeLabel=${(field: HaFormSchema) => t(`editor.${field.name}`)}
      .computeHelper=${(field: HaFormSchema) => {
        const key = `editor.helper.${field.name}`;
        const helper = t(key);

        return helper === key ? undefined : helper;
      }}
      @value-changed=${this.valueChanged}
    ></ha-form>`;
  }

  private readonly valueChanged = (event: ValueChangedEvent): void => {
    event.stopPropagation();

    if (!this.config) {
      return;
    }

    const value = compact({ ...event.detail.value });
    const battery = value.battery;

    if (battery && typeof battery === 'object' && !Array.isArray(battery)) {
      const cleaned = compact(battery as Record<string, unknown>);

      if (Object.keys(cleaned).length === 0) {
        delete value.battery;
      } else {
        value.battery = cleaned;
      }
    }

    const config = { ...value, type: this.config.type } as BaseCardConfig;
    this.config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
  };
}
