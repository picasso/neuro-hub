import { map } from 'lodash'
import { pictures } from './pictures'

export const imageUrls = {
	base: '/playground/pictures',
	card: 'https://bycp5hmwsix5qx2u.public.blob.vercel-storage.com/portfolio/XD5LXKVkaPXvPFDNS0tfwYWPeirXGbT2/fantasy-01-QlbQcYix5SMh60NYLd8fg2BBF1E3Ei.jpg',
	github: 'https://github.com/github.png',
	avatar: 'https://avatars.githubusercontent.com/u/399395',
	banner: 'https://raw.githubusercontent.com/wiki/picasso/zukit/assets/banner-1544x500.png',
} as const

export const mediaUrls = {
	video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
	audio: 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
	pdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
} as const

export const text = {
	title: {
		dialog: 'Заголовок диалога',
		auth: 'Login to your account',
	},
	preview: {
		short: 'Короткий превью-текст',
	},
	lorem: {
		short: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
		long: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
	},
	placeholder: {
		composer: 'Введите какой-нибудь текст…',
		email: 'user@example.com',
		desc: 'Введите описание...',
		uploader: 'Выберите медиафайл для портфолио',
	},
	desc: {
		dialog: 'Описание с `markdown` поддержкой: **bold**, *italic*, [ссылки](https://example.com).',
		toolbar: 'Описание диалога для проверки обрезки и выравнивания',
		auth: 'Enter your email below to login to your account',
		empty: 'Создайте первую запись или импортируйте данные из файла.',
		states: 'Различные состояния: **List / Loading / Error / Empty**',
	},
} as const

export const dates = {
	mar_28: new Date('2026-03-28T09:30:00.000Z'),
	apr_02: new Date('2026-04-02T09:30:00.000Z'),
	apr_05: new Date('2026-04-05T14:12:00.000Z'),
	apr_06: new Date('2026-04-06T08:00:00.000Z'),
	may_20: new Date('2026-05-20T18:00:00.000Z'),
	jun_01: new Date('2026-06-01T12:00:00.000Z'),
	jun_10: new Date('2026-06-10T18:00:00.000Z'),
} as const

export function getPictureUrl(file: string) {
	return `${imageUrls.base}/${file}`
}

export function getPictureUrls() {
	return map(pictures, (picture) => getPictureUrl(picture.file))
}
