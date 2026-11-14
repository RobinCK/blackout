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

type Translate = (key: string) => string;

const boolean = (name: string): HaFormSelectorField => ({ name, selector: { boolean: {} } });

const number = (name: string, min: number, max: number, step = 1): HaFormSelectorField => ({
  name,
  selector: { number: { min, max, step, mode: 'box' } },
});

const object = (name: string): HaFormSelectorField => ({ name, selector: { object: {} } });

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

function entityField(required: boolean): HaFormSelectorField {
  return {
    name: 'entity',
    required,
    selector: { entity: { filter: { integration: 'blackout' } } },
  };
}

function battery(t: Translate): HaFormExpandable {
  const sensor = (name: string): HaFormSelectorField => ({
    name,
    selector: { entity: { filter: { domain: 'sensor' } } },
  });

  return {
    type: 'expandable',
    name: 'battery',
    title: t('editor.battery'),
    schema: [
      sensor('soc'),
      sensor('power'),
      sensor('load'),
      number('capacity', 0, 1000, 0.1),
      number('reserve', 0, 100),
      select('power_positive', ['discharge', 'charge'], t),
      number('morning_hour', 0, 23),
    ],
  };
}

function advanced(t: Translate): HaFormExpandable {
  return {
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
      { name: 'time_zone', selector: { text: {} } },
      select('tap_action', ['more-info', 'none'], t),
      object('labels'),
      object('colors'),
    ],
  };
}

function common(required: boolean): HaFormSchema[] {
  return [entityField(required), { name: 'title', selector: { text: {} } }, boolean('show_header')];
}

export function schemaFor(type: string, t: Translate): readonly HaFormSchema[] {
  const cardType = type.replace(/^custom:/, '');

  switch (cardType) {
    case STATUS_CARD_TYPE:
      return [
        ...common(true),
        boolean('show_badge'),
        boolean('show_timeline'),
        boolean('show_stats'),
        number('timeline_hours', 2, 48),
        number('timeline_offset', 0, 24),
        object('stats'),
        battery(t),
        advanced(t),
      ];
    case SCHEDULE_CARD_TYPE:
      return [
        ...common(true),
        select('days', ['today', 'tomorrow'], t, true),
        boolean('show_source'),
        boolean('show_now'),
        boolean('show_legend'),
        boolean('show_windows'),
        boolean('show_totals'),
        battery(t),
        advanced(t),
      ];
    case WEEK_CARD_TYPE:
      return [
        ...common(true),
        number('days', 1, 90),
        boolean('show_badge'),
        boolean('show_stats'),
        boolean('show_schedule'),
        boolean('show_legend'),
        boolean('show_next'),
        battery(t),
        advanced(t),
      ];
    case RECORDS_CARD_TYPE:
      return [
        ...common(false),
        { name: 'since', selector: { text: {} } },
        number('columns', 1, 4),
        object('items'),
        advanced(t),
      ];
    default:
      return common(true);
  }
}
