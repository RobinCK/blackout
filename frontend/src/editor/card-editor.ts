import { css, html, LitElement, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';

import { BATTERY_DEFAULTS } from '../defaults';
import { createTranslator, type Translator } from '../i18n';
import type { BaseCardConfig, BatteryConfig, VoltagePhase } from '../types/config';
import type { HassEntity, HomeAssistant } from '../types/ha';
import { loadHaComponents } from './load-ha-components';
import {
  layoutFor,
  resetRows,
  stripDefaults,
  type BatteryLayout,
  type BatterySensor,
  type HaFormSchema,
} from './schema';

interface ValueChangedEvent extends Event {
  readonly detail: { readonly value: unknown };
}

interface PickerOptions {
  readonly label: string;
  readonly value: string | undefined;
  readonly required: boolean;
  readonly filter: (entity: HassEntity) => boolean;
  readonly onChange: (entity: string | undefined) => void;
}

type EditableConfig = BaseCardConfig & {
  readonly battery?: BatteryConfig;
  readonly phases?: readonly VoltagePhase[];
};

const SENSOR_DOMAINS: readonly string[] = ['sensor'];
const PHASES = ['L1', 'L2', 'L3'] as const;
const POWER_UNITS = new Set(['w', 'kw']);

function isPower(entity: HassEntity): boolean {
  const unit = entity.attributes.unit_of_measurement;

  return (
    entity.attributes.device_class === 'power' ||
    (typeof unit === 'string' && POWER_UNITS.has(unit.toLowerCase()))
  );
}

function isVoltage(entity: HassEntity): boolean {
  return (
    entity.attributes.device_class === 'voltage' || entity.attributes.unit_of_measurement === 'V'
  );
}

const BATTERY_FILTERS: Readonly<Record<BatterySensor, (entity: HassEntity) => boolean>> = {
  soc: (entity) =>
    entity.attributes.device_class === 'battery' || entity.attributes.unit_of_measurement === '%',
  power: isPower,
  load: isPower,
};

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null || value === '') {
    return true;
  }

  return typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0;
}

function compact<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => !isEmpty(item))) as T;
}

export class BlackoutCardEditor extends LitElement {
  static override styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    ha-entity-picker {
      display: block;
      min-width: 0;
    }

    .panel-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0 4px;
    }

    .hint {
      color: var(--secondary-text-color);
      font-size: 13px;
      line-height: 1.4;
    }
  `;

  @property({ attribute: false }) accessor hass: HomeAssistant | undefined;

  @state() private accessor config: EditableConfig | undefined;

  private translator: Translator = createTranslator('en');

  setConfig(config: EditableConfig): void {
    this.config = config;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    void loadHaComponents().then(() => this.requestUpdate());
  }

  protected override willUpdate(): void {
    this.translator = createTranslator(this.hass?.locale?.language ?? this.hass?.language);
  }

  private t(key: string): string {
    return this.translator.t(key);
  }

  protected override render(): TemplateResult | typeof nothing {
    const config = this.config;

    if (!this.hass || !config) {
      return nothing;
    }

    const layout = layoutFor(config.type, config, (key) => this.t(key));
    const data = { ...layout.defaults, ...config };
    const onChange = (value: EditableConfig): void => {
      this.commit(
        resetRows(
          {
            ...stripDefaults(value, layout.defaults),
            entity: config.entity,
            battery: config.battery,
          },
          config,
        ),
      );
    };

    return html`<div class="editor">
      ${this.renderPicker({
        label: this.t('editor.entity'),
        value: config.entity,
        required: layout.entityRequired,
        filter: this.isQueueEntity,
        onChange: (entity) => {
          this.commit({ ...config, entity });
        },
      })}
      ${this.renderForm(layout.main, data, onChange)}
      ${layout.phases ? this.renderPhases(config.phases ?? []) : nothing}
      ${layout.battery ? this.renderBattery(layout.battery, config.battery ?? {}) : nothing}
      ${this.renderForm(layout.advanced, data, onChange)}
    </div>`;
  }

  private renderBattery(layout: BatteryLayout, battery: BatteryConfig): TemplateResult {
    const count = layout.sensors.filter((key) => battery[key]).length;

    return html`<ha-expansion-panel
      outlined
      .header=${this.t('editor.battery')}
      .secondary=${this.translator.plural('editor.sensors', count)}
      .expanded=${count > 0}
    >
      <div class="panel-content">
        <div class="hint">${layout.hint}</div>
        ${layout.sensors.map((key) =>
          this.renderPicker({
            label: this.t(`editor.${key}`),
            value: battery[key],
            required: false,
            filter: BATTERY_FILTERS[key],
            onChange: (entity) => {
              this.updateBattery({ ...battery, [key]: entity });
            },
          }),
        )}
        ${this.renderForm(layout.schema, { ...BATTERY_DEFAULTS, ...battery }, (value) => {
          this.updateBattery(stripDefaults(value, BATTERY_DEFAULTS));
        })}
      </div>
    </ha-expansion-panel>`;
  }

  private renderPhases(phases: readonly VoltagePhase[]): TemplateResult {
    const count = phases.flatMap((phase) => [phase.input, phase.output]).filter(Boolean).length;

    return html`<ha-expansion-panel
      outlined
      expanded
      .header=${this.t('editor.phases')}
      .secondary=${this.translator.plural('editor.sensors', count)}
    >
      <div class="panel-content">
        <div class="hint">${this.t('editor.phases_hint')}</div>
        ${PHASES.map(
          (phase, index) =>
            html`${this.renderPicker({
              label: this.translator.t('editor.phase_input', { phase }),
              value: phases[index]?.input,
              required: index === 0,
              filter: isVoltage,
              onChange: (entity) => {
                this.updatePhase(index, { input: entity });
              },
            })}
            ${this.renderPicker({
              label: this.translator.t('editor.phase_output', { phase }),
              value: phases[index]?.output,
              required: false,
              filter: isVoltage,
              onChange: (entity) => {
                this.updatePhase(index, { output: entity });
              },
            })}`,
        )}
      </div>
    </ha-expansion-panel>`;
  }

  private updatePhase(index: number, patch: VoltagePhase): void {
    if (!this.config) {
      return;
    }

    const current = this.config.phases ?? [];
    const phases = PHASES.map((_, position) =>
      compact({ ...current[position], ...(position === index ? patch : {}) }),
    );

    while (phases.length > 0 && isEmpty(phases.at(-1))) {
      phases.pop();
    }

    this.commit({ ...this.config, phases: phases.length > 0 ? phases : undefined });
  }

  private renderPicker(options: PickerOptions): TemplateResult {
    return html`<ha-entity-picker
      .hass=${this.hass}
      .value=${options.value ?? ''}
      .label=${options.label}
      .helper=${options.value}
      .required=${options.required}
      .includeDomains=${SENSOR_DOMAINS}
      .entityFilter=${options.filter}
      .showEntityId=${true}
      @value-changed=${(event: ValueChangedEvent) => {
        event.stopPropagation();
        const value = event.detail.value;
        options.onChange(typeof value === 'string' && value ? value : undefined);
      }}
    ></ha-entity-picker>`;
  }

  private renderForm<T extends object>(
    schema: readonly HaFormSchema[],
    data: T,
    onChange: (value: T) => void,
  ): TemplateResult {
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${schema}
      .computeLabel=${(field: HaFormSchema) => this.t(`editor.${field.name}`)}
      .computeHelper=${(field: HaFormSchema) => {
        const key = `editor.helper.${field.name}`;
        const helper = this.t(key);

        return helper === key ? undefined : helper;
      }}
      @value-changed=${(event: ValueChangedEvent) => {
        event.stopPropagation();
        onChange(event.detail.value as T);
      }}
    ></ha-form>`;
  }

  private readonly isQueueEntity = (entity: HassEntity): boolean => {
    const registry = this.hass?.entities;

    if (!registry) {
      return typeof entity.attributes.group === 'string';
    }

    return registry[entity.entity_id]?.platform === 'blackout';
  };

  private updateBattery(battery: BatteryConfig): void {
    const cleaned = compact(battery);

    if (!this.config) {
      return;
    }

    this.commit({ ...this.config, battery: isEmpty(cleaned) ? undefined : cleaned });
  }

  private commit(next: EditableConfig): void {
    if (!this.config) {
      return;
    }

    const config = { ...compact(next), type: this.config.type };
    this.config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config }, bubbles: true, composed: true }),
    );
  }
}
