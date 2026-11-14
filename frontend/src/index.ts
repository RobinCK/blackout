import { BlackoutRecordsCard } from './cards/records-card';
import { BlackoutScheduleCard } from './cards/schedule-card';
import { BlackoutStatusCard } from './cards/status-card';
import { BlackoutWeekCard } from './cards/week-card';
import {
  DOCUMENTATION_URL,
  EDITOR_TYPE,
  RECORDS_CARD_TYPE,
  SCHEDULE_CARD_TYPE,
  STATUS_CARD_TYPE,
  WEEK_CARD_TYPE,
} from './const';
import { BlackoutCardEditor } from './editor/card-editor';
import type { CustomCardEntry } from './types/ha';

const ELEMENTS: readonly (readonly [string, CustomElementConstructor])[] = [
  [STATUS_CARD_TYPE, BlackoutStatusCard],
  [SCHEDULE_CARD_TYPE, BlackoutScheduleCard],
  [WEEK_CARD_TYPE, BlackoutWeekCard],
  [RECORDS_CARD_TYPE, BlackoutRecordsCard],
  [EDITOR_TYPE, BlackoutCardEditor],
];

const CARDS: readonly CustomCardEntry[] = [
  {
    type: STATUS_CARD_TYPE,
    name: 'Blackout status',
    description:
      'Power now, countdown to the next outage or to power back, grid and battery timeline.',
  },
  {
    type: SCHEDULE_CARD_TYPE,
    name: 'Blackout schedule',
    description: 'Outage schedule for today and tomorrow by half hours, windows and totals.',
  },
  {
    type: WEEK_CARD_TYPE,
    name: 'Blackout week',
    description:
      'Actual outages of the last days with the schedule, availability and the next outage.',
  },
  {
    type: RECORDS_CARD_TYPE,
    name: 'Blackout records',
    description: 'Outage records and any records from long-term statistics.',
  },
];

for (const [name, element] of ELEMENTS) {
  if (!customElements.get(name)) {
    customElements.define(name, element);
  }
}

window.customCards = window.customCards ?? [];

for (const card of CARDS) {
  if (!window.customCards.some((entry) => entry.type === card.type)) {
    window.customCards.push({ ...card, preview: true, documentationURL: DOCUMENTATION_URL });
  }
}

console.info(`%c BLACKOUT CARDS %c ${__CARD_VERSION__} `, 'font-weight: bold', '');
