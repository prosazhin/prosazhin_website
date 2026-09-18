import dayjs from 'dayjs';
import 'dayjs/locale/en';
import 'dayjs/locale/ru';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ucFirst(value: any) {
  if (!value) {
    return value;
  }

  return value[0].toUpperCase() + value.slice(1);
}

export function getFormatDate(value: string, locale: string) {
  return dayjs(value).locale(locale).format('DD MMMM YYYY');
}

export function getFormatJobDate(value: string, locale: string) {
  return dayjs(value).locale(locale).format('MMMM YYYY');
}

type TFunction = (key: string, options?: Record<string, unknown>) => string;

// Длительность как «N лет M месяцев»: годы и месяцы считаем отдельно, а не
// округляем до одной ближайшей единицы — иначе период вроде 2 лет 9 месяцев
// показывался бы просто как «3 года».
export function getFormatDuration(start: string, end: string, t: TFunction) {
  const totalMonths = Math.max(dayjs(end).diff(start, 'month'), 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return [
    years > 0 && t('plurals.year.year', { count: years }),
    (months > 0 || years === 0) && t('plurals.month.month', { count: months }),
  ]
    .filter(Boolean)
    .join(' ');
}

// Период работы: всегда месяц и год («Октябрь 2022 – Март 2023»), плюс общая
// длительность в годах и месяцах. Без сокращения до одних годов — иначе для
// мест без соседей с понятными датами (после вынесения из групп) период
// читается как разрыв, который приходится высчитывать по другим местам рядом.
export function getFormatJobPeriod(dateFrom: string, dateTo: string, locale: string, t: TFunction) {
  const end = dateTo === 'now' ? String(new Date()) : dateTo;
  const from = ucFirst(getFormatJobDate(dateFrom, locale));
  const to = dateTo === 'now' ? t('now') : ucFirst(getFormatJobDate(dateTo, locale));
  const duration = getFormatDuration(dateFrom, end, t);

  return from === to ? `${from}, ${duration}` : `${from} – ${to}, ${duration}`;
}

export function getYearsDiff(start: string, end: string) {
  return Math.abs(dayjs(start).diff(end, 'years'));
}
