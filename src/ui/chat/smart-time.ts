import 'dayjs/locale/ru'

import { dayjs, type Dayjs } from '@/utils/common'

export function smartTime(
	timestamp: string | Date | Dayjs | null | undefined,
	withTime = true,
	now = new Date(),
) {
	const date = dayjs(timestamp ?? now).locale('ru')

	if (!date.isValid()) {
		return String(timestamp)
	}

	const reference = dayjs(now).locale('ru')
	const dayDiff = reference.startOf('day').diff(date.startOf('day'), 'day')

	if (dayDiff === 0) {
		if (withTime) return date.format('HH:mm')
		if (date.isSame(reference, 'minute')) return 'совсем недавно'
		if (date.isSame(reference, 'hour')) return 'несколько минут назад'
		return 'несколько часов назад'
	}

	if (dayDiff === 1) {
		return withTime ? `вчера ${date.format('HH:mm')}` : 'вчера'
	}

	if (dayDiff >= 2 && dayDiff <= 6) {
		return date.format(withTime ? 'dddd HH:mm' : 'dddd')
	}

	if (date.isSame(reference, 'year')) {
		return date.format(withTime ? 'D.MM' : 'D MMMM')
	}

	return date.format('DD.MM.YY')
}

export function fullTime(timestamp: string | Date | Dayjs | null | undefined) {
	const date = dayjs(timestamp ?? new Date()).locale('ru')
	return !date.isValid() ? null : date.format('DD.MM.YY HH:mm')
}

export function fullTimeMonth(
	timestamp: string | Date | Dayjs | null | undefined,
	short?: boolean,
	withTime?: boolean,
) {
	const date = dayjs(timestamp ?? new Date()).locale('ru')
	const format = short ? 'D MMMM' : 'DD MMMM YYYY'
	const timeFormat = withTime ? ' HH:mm' : ''
	return !date.isValid() ? null : date.format(format + timeFormat)
}
