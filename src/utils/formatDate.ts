import {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
  isThisYear,
} from 'date-fns'

export const formatPostDate = (date: number) => {
  const formatShort = format(new Date(date), 'MMMM d').toUpperCase()

  const formatLong = format(new Date(date), 'MMMM d, yyy').toUpperCase()

  return isThisYear(new Date(date)) ? formatShort : formatLong
}

export const formatDateToNow = (date: number) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true }).toUpperCase()
}

export const formatDateToNowShort = (date: number) => {
  return formatDistanceToNowStrict(new Date(date))
    .split(' ')
    .map((s, i) => (i === 1 ? s[0] : s))
    .join('')
}
