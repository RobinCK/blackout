import { RECORDS_CARD_TYPE, SCHEDULE_CARD_TYPE, STATUS_CARD_TYPE, WEEK_CARD_TYPE } from '../const';
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

export interface EditorLayout {
  readonly entityRequired: boolean;
  readonly main: readonly HaFormSchema[];
  readonly battery: readonly HaFormSchema[] | null;
  readonly advanced: readonly HaFormSchema[];
}

type Translate = (key: string) => string;

export const BATTERY_SENSORS = ['soc', 'power', 'load'] as const;

export type BatterySensor = (typeof BATTERY_SENSORS)[number];

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

function batteryFields(t: Translate): readonly HaFormSchema[] {
  return [
    number('capacity', 0, 1000, 0.1),
    number('reserve', 0, 100),
    select('power_positive', ['discharge', 'charge'], t),
    number('morning_hour', 0, 23),
  ];
}

function advanced(t: Translate): readonly HaFormSchema[] {
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
        select('tap_action', ['more-info', 'none'], t),
        object('labels'),
        object('colors'),
      ],
    },
  ];
}

const header = (): HaFormSchema[] => [text('title'), boolean('show_header')];

export function layoutFor(type: string, t: Translate): EditorLayout {
  const cardType = type.replace(/^custom:/, '');
  const base = { entityRequired: true, advanced: advanced(t) };

  switch (cardType) {
    case STATUS_CARD_TYPE:
      return {
        ...base,
        main: [
          ...header(),
          boolean('show_badge'),
          boolean('show_timeline'),
          boolean('show_stats'),
          number('timeline_hours', 2, 48),
          number('timeline_offset', 0, 24),
          object('stats'),
        ],
        battery: batteryFields(t),
      };
    case SCHEDULE_CARD_TYPE:
      return {
        ...base,
        main: [
          ...header(),
          select('days', ['today', 'tomorrow'], t, true),
          boolean('show_source'),
          boolean('show_now'),
          boolean('show_legend'),
          boolean('show_windows'),
          boolean('show_totals'),
        ],
        battery: batteryFields(t),
      };
    case WEEK_CARD_TYPE:
      return {
        ...base,
        main: [
          ...header(),
          number('days', 1, 90),
          boolean('show_badge'),
          boolean('show_stats'),
          boolean('show_schedule'),
          boolean('show_legend'),
          boolean('show_next'),
        ],
        battery: batteryFields(t),
      };
    case RECORDS_CARD_TYPE:
      return {
        ...base,
        entityRequired: false,
        main: [...header(), text('since'), number('columns', 1, 4), object('items')],
        battery: null,
      };
    default:
      return { ...base, main: header(), battery: null };
  }
}
