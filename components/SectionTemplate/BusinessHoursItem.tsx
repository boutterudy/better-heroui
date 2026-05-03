'use client';

import { useState } from 'react';
import { Link } from '@heroui/react';
import { ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr/CaretDown';
import { twMerge } from 'tailwind-merge';

// ── Google Business API v4 types ──────────────────────────────────────────────

export type DayOfWeek =
  | 'DAY_OF_WEEK_UNSPECIFIED'
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

type TimePeriod = {
  openDay: DayOfWeek;
  openTime: string; // "HH:MM"
  closeDay: DayOfWeek;
  closeTime: string; // "HH:MM"
};

export type BusinessHours = {
  periods: Array<TimePeriod>;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

// Matches JS Date.getDay(): 0 = Sunday, 1 = Monday, …, 6 = Saturday
const DAY_ORDER: Array<DayOfWeek> = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  DAY_OF_WEEK_UNSPECIFIED: '',
  SUNDAY: 'dimanche',
  MONDAY: 'lundi',
  TUESDAY: 'mardi',
  WEDNESDAY: 'mercredi',
  THURSDAY: 'jeudi',
  FRIDAY: 'vendredi',
  SATURDAY: 'samedi',
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m ?? 0);
}

function getPeriodsForDay(
  periods: Array<TimePeriod>,
  day: DayOfWeek,
): Array<TimePeriod> {
  return periods.filter(p => p.openDay === day);
}

function isCurrentlyOpen(
  periods: Array<TimePeriod>,
  today: DayOfWeek,
  nowMinutes: number,
): boolean {
  return getPeriodsForDay(periods, today).some(p => {
    const open = timeToMinutes(p.openTime);
    const close = timeToMinutes(p.closeTime);
    if (close < open) {
      return nowMinutes >= open || nowMinutes < close;
    }
    return nowMinutes >= open && nowMinutes < close;
  });
}

type NextTransition = {
  label: string;
};

function getNextTransition(
  periods: Array<TimePeriod>,
  today: DayOfWeek,
  nowMinutes: number,
  isOpen: boolean,
): NextTransition {
  const todayPeriods = getPeriodsForDay(periods, today);

  if (isOpen) {
    const activePeriod = todayPeriods.find(p => {
      const open = timeToMinutes(p.openTime);
      const close = timeToMinutes(p.closeTime);
      if (close < open) return nowMinutes >= open || nowMinutes < close;
      return nowMinutes >= open && nowMinutes < close;
    });
    if (activePeriod) {
      return { label: `Ferme à ${activePeriod.closeTime}` };
    }
  }

  const nextTodayPeriod = todayPeriods
    .filter(p => timeToMinutes(p.openTime) > nowMinutes)
    .sort((a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime))[0];

  if (nextTodayPeriod) {
    return { label: `Ouvre à ${nextTodayPeriod.openTime}` };
  }

  const todayIndex = DAY_ORDER.indexOf(today);
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = DAY_ORDER[(todayIndex + offset) % 7];
    const nextDayPeriods = getPeriodsForDay(periods, nextDay).sort(
      (a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime),
    );
    if (nextDayPeriods.length > 0) {
      return {
        label: `Ouvre à ${nextDayPeriods[0].openTime} ${DAY_LABELS[nextDay]}`,
      };
    }
  }

  return { label: 'Fermé' };
}

function formatDayHours(
  periods: Array<TimePeriod>,
  day: DayOfWeek,
): Array<string> {
  const dayPeriods = getPeriodsForDay(periods, day).sort(
    (a, b) => timeToMinutes(a.openTime) - timeToMinutes(b.openTime),
  );
  if (dayPeriods.length === 0) return ['Fermé'];
  return dayPeriods.map(p => `${p.openTime} – ${p.closeTime}`);
}

// ── BusinessHoursItem ─────────────────────────────────────────────────────────

export type BusinessHoursItemProps = {
  businessHours: BusinessHours;
  bookSlotHref: string;
  showIcon?: boolean;
};

export const BusinessHoursItem = ({
  businessHours,
  bookSlotHref,
  showIcon = true,
}: BusinessHoursItemProps) => {
  const [expanded, setExpanded] = useState(false);

  const now = new Date();
  const today = DAY_ORDER[now.getDay()];
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const isOpen = isCurrentlyOpen(businessHours.periods, today, nowMinutes);
  const { label: nextLabel } = getNextTransition(
    businessHours.periods,
    today,
    nowMinutes,
    isOpen,
  );

  const todayIndex = DAY_ORDER.indexOf(today);
  const orderedDays = Array.from(
    { length: 7 },
    (_, i) => DAY_ORDER[(todayIndex + i) % 7],
  );

  if (!showIcon) {
    return (
      <div className="gap-xs flex flex-col">
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="gap-xs flex cursor-pointer items-center text-base"
        >
          <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
            {isOpen ? 'Ouvert' : 'Fermé'}
          </span>
          <span>·</span>
          <span>{nextLabel}</span>
          <CaretDownIcon
            size={16}
            className={twMerge(
              'transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        </button>
        {expanded && (
          <div className="gap-xs mt-xs flex flex-col">
            <p
              className={twMerge(
                'text-sm font-bold',
                isOpen ? 'text-green-600' : 'text-red-600',
              )}
            >
              {isOpen ? 'Ouvert' : "Fermé aujourd'hui"}
            </p>
            <table className="mb-[8px] text-sm">
              <tbody>
                {orderedDays.map(day => {
                  const isToday = day === today;
                  const lines = formatDayHours(businessHours.periods, day);
                  return (
                    <tr key={day} className="align-top">
                      <td
                        className={twMerge(
                          'pr-m w-28 pb-[4px] capitalize',
                          isToday && 'font-bold',
                        )}
                      >
                        {DAY_LABELS[day]}
                      </td>
                      <td
                        className={twMerge('pb-[4px]', isToday && 'font-bold')}
                      >
                        {lines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <Link href={bookSlotHref} className="gap-xs flex items-center">
          Trouver un créneau
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="gap-m flex flex-row items-start">
      <div className="flex size-8 shrink-0 items-center justify-center">
        <ClockIcon size={32} />
      </div>
      <div className="gap-xs flex flex-col">
        {/* Collapsed toggle */}
        <button
          type="button"
          onClick={() => setExpanded(prev => !prev)}
          className="gap-xs flex cursor-pointer items-center text-base"
        >
          <span className={isOpen ? 'text-green-600' : 'text-red-600'}>
            {isOpen ? 'Ouvert' : 'Fermé'}
          </span>
          <span>·</span>
          <span>{nextLabel}</span>
          <CaretDownIcon
            size={16}
            className={twMerge(
              'transition-transform duration-200',
              expanded && 'rotate-180',
            )}
          />
        </button>

        {/* Expanded accordion */}
        {expanded && (
          <div className="gap-xs mt-xs flex flex-col">
            <p
              className={twMerge(
                'text-sm font-bold',
                isOpen ? 'text-green-600' : 'text-red-600',
              )}
            >
              {isOpen ? 'Ouvert' : "Fermé aujourd'hui"}
            </p>
            <table className="mb-[8px] text-sm">
              <tbody>
                {orderedDays.map(day => {
                  const isToday = day === today;
                  const lines = formatDayHours(businessHours.periods, day);
                  return (
                    <tr key={day} className="align-top">
                      <td
                        className={twMerge(
                          'pr-m w-28 pb-[4px] capitalize',
                          isToday && 'font-bold',
                        )}
                      >
                        {DAY_LABELS[day]}
                      </td>
                      <td
                        className={twMerge('pb-[4px]', isToday && 'font-bold')}
                      >
                        {lines.map((line, i) => (
                          <span key={i} className="block">
                            {line}
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* CTA */}
        <Link href={bookSlotHref} className="gap-xs flex items-center">
          Trouver un créneau
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
};
