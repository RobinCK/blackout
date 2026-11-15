import {
  BATTERY_CARD_TYPE,
  RECORDS_CARD_TYPE,
  SCHEDULE_CARD_TYPE,
  STATUS_CARD_TYPE,
  VOLTAGE_CARD_TYPE,
  WEEK_CARD_TYPE,
} from '../const';
import { CARD_DEFAULTS, type ConfigValues } from '../defaults';
import { LANGUAGES } from '../i18n';

export interface HaFormSelectorField {
  readonly name: string;
  readonly selector: Readonly<Record<string, unknown>>;
  readonly required?: boolean;
}

export interface HaFormExpandable {
  readonly type: 'expandable';
  readonly name: string;
  readonly title: string;
  readonly flatten?: boolean;
  readonly schema: readonly HaFormSchema[];
}

export type HaFormSchema = HaFormSelectorField | HaFormExpandable;

export type BatterySensor = 'soc' | 'power' | 'load';

type Flag = 'show_header' | 'show_timeline' | 'show_stats' | 'show_windows' | 'show_next';

export interface EditorConfig extends Partial<Readonly<Record<Flag, boolean>>> {
  readonly entity?: string;
  readonly battery?: { readonly power?: string };
}

export interface BatteryLayout {
  readonly sensors: readonly BatterySensor[];
  readonly schema: readonly HaFormSchema[];
  readonly hint: string;
}

export interface EditorLayout {
  readonly entityRequired: boolean;
  readonly defaults: ConfigValues;
  readonly main: readonly HaFormSchema[];
  readonly battery: BatteryLayout | null;
  readonly phases?: boolean;
  readonly advanced: readonly HaFormSchema[];
}

type Translate = (key: string) => string;

const boolean = (name: string): HaFormSelectorField => ({ name, selector: { boolean: {} } });

const number = (name: string, min: number, max: number, step = 1): HaFormSelectorField => ({
  name,
  selector: { number: { min, max, step, mode: 'box' } },
});

const object = (name: string): HaFormSelectorField => ({ name, selector: { object: {} } });

const text = (name: string): HaFormSelectorField => ({ name, selector: { text: {} } });

const select = (
  name: string,
  options: readonly string[],
  t: Translate,
  multiple = false,
): HaFormSelectorField => ({
  name,
  selector: {
    select: {
      multiple,
      mode: 'dropdown',
      options: options.map((value) => ({ value, label: t(`editor.option.${value}`) })),
    },
  },
});

const enabled = (config: EditorConfig, key: Flag): boolean => config[key] !== false;

const when = (condition: boolean, ...fields: readonly HaFormSchema[]): readonly HaFormSchema[] =>
  condition ? fields : [];

function header(config: EditorConfig, ...extra: readonly HaFormSchema[]): readonly HaFormSchema[] {
  return [boolean('show_header'), ...when(enabled(config, 'show_header'), text('title'), ...extra)];
}

function battery(
  config: EditorConfig,
  t: Translate,
  sensors: readonly BatterySensor[],
  hint: string,
  ...extra: readonly HaFormSchema[]
): BatteryLayout {
  return {
    sensors,
    hint,
    schema: [
      number('capacity', 0, 1000, 0.1),
      number('reserve', 0, 100),
      ...when(Boolean(config.battery?.power), select('power_positive', ['discharge', 'charge'], t)),
      ...extra,
    ],
  };
}

function advanced(t: Translate, clickable: boolean): readonly HaFormSchema[] {
  return [
    {
      type: 'expandable',
      name: 'advanced',
      title: t('editor.advanced'),
      flatten: true,
      schema: [
        {
          name: 'language',
          selector: {
            select: {
              mode: 'dropdown',
              options: LANGUAGES.map((value) => ({ value, label: value.toUpperCase() })),
            },
          },
        },
        text('time_zone'),
        ...when(clickable, select('tap_action', ['more-info', 'none'], t)),
        object('labels'),
        object('colors'),
      ],
    },
  ];
}

function statusLayout(
  config: EditorConfig,
  t: Translate,
): Omit<EditorLayout, 'defaults' | 'advanced'> {
  const timeline = enabled(config, 'show_timeline');
  const stats = enabled(config, 'show_stats');

  return {
    entityRequired: true,
    main: [
      ...header(config, boolean('show_badge')),
      boolean('show_timeline'),
      ...when(timeline, number('timeline_hours', 2, 48), number('timeline_offset', 0, 24)),
      boolean('show_stats'),
      ...when(stats, object('stats')),
    ],
    battery:
      timeline || stats
        ? battery(
            config,
            t,
            ['soc', 'power', 'load'],
            t('editor.battery_hint.status'),
            ...when(stats, number('morning_hour', 0, 23)),
          )
        : null,
  };
}

function scheduleLayout(
  config: EditorConfig,
  t: Translate,
): Omit<EditorLayout, 'defaults' | 'advanced'> {
  const windows = enabled(config, 'show_windows');

  return {
    entityRequired: true,
    main: [
      ...header(config),
      select('days', ['today', 'tomorrow'], t, true),
      boolean('show_source'),
      boolean('show_now'),
      boolean('show_legend'),
      boolean('show_windows'),
      boolean('show_totals'),
    ],
    battery: windows
      ? battery(config, t, ['soc', 'power'], t('editor.battery_hint.schedule'))
      : null,
  };
}

function weekLayout(
  config: EditorConfig,
  t: Translate,
): Omit<EditorLayout, 'defaults' | 'advanced'> {
  const next = enabled(config, 'show_next');

  return {
    entityRequired: true,
    main: [
      ...header(config, boolean('show_badge')),
      number('days', 1, 90),
      boolean('show_stats'),
      boolean('show_schedule'),
      boolean('show_legend'),
      boolean('show_next'),
    ],
    battery: next
      ? battery(config, t, ['soc', 'power', 'load'], t('editor.battery_hint.week'))
      : null,
  };
}

function recordsLayout(config: EditorConfig): Omit<EditorLayout, 'defaults' | 'advanced'> {
  return {
    entityRequired: false,
    main: [...header(config, text('since')), number('columns', 1, 4), object('items')],
    battery: null,
  };
}

function batteryLayout(
  config: EditorConfig,
  t: Translate,
): Omit<EditorLayout, 'defaults' | 'advanced'> {
  return {
    entityRequired: false,
    main: header(config),
    battery: battery(config, t, ['soc', 'power', 'load'], t('editor.battery_hint.battery')),
  };
}

function voltageLayout(config: EditorConfig): Omit<EditorLayout, 'defaults' | 'advanced'> {
  return {
    entityRequired: false,
    main: [...header(config), number('voltage_min', 100, 250), number('voltage_max', 200, 300)],
    battery: null,
    phases: true,
  };
}

function cardLayout(
  cardType: string,
  config: EditorConfig,
  t: Translate,
): Omit<EditorLayout, 'defaults' | 'advanced'> {
  switch (cardType) {
    case STATUS_CARD_TYPE:
      return statusLayout(config, t);
    case SCHEDULE_CARD_TYPE:
      return scheduleLayout(config, t);
    case WEEK_CARD_TYPE:
      return weekLayout(config, t);
    case RECORDS_CARD_TYPE:
      return recordsLayout(config);
    case BATTERY_CARD_TYPE:
      return batteryLayout(config, t);
    case VOLTAGE_CARD_TYPE:
      return voltageLayout(config);
    default:
      return { entityRequired: true, main: header(config), battery: null };
  }
}

export function layoutFor(type: string, config: EditorConfig, t: Translate): EditorLayout {
  const cardType = type.replace(/^custom:/, '');
  const clickable = enabled(config, 'show_header') && Boolean(config.entity);

  return {
    ...cardLayout(cardType, config, t),
    defaults: CARD_DEFAULTS[cardType] ?? {},
    advanced: advanced(t, clickable),
  };
}

export function stripDefaults<T extends object>(value: T, defaults: ConfigValues): T {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([key, item]) => !(key in defaults) || JSON.stringify(item) !== JSON.stringify(defaults[key]),
    ),
  ) as T;
}
