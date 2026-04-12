import { isString } from 'lodash'

// склонение существительного по числительному (русская грамматика).
// формы: [1, 21, 31...], [2, 3, 4, 22, 23...], [0, 5–20, 25–30...]
//
// pluralizeRu(1, ['работа', 'работы', 'работ'])   // 'работа'
// pluralizeRu(2, ['работа', 'работы', 'работ'])   // 'работы'
// pluralizeRu(5, ['работа', 'работы', 'работ'])   // 'работ'
// pluralizeRu(21, ['балл', 'балла', 'баллов'])   // 'балл'
export function pluralizeRu(n: number, forms: readonly [string, string, string]): string {
	const num = Math.abs(Math.floor(Number(n)))
	if (Number.isNaN(num)) return forms[2]

	// 11–14 всегда форма 3 (мн. ч.)
	if (num % 100 >= 11 && num % 100 <= 14) return forms[2]

	const cases: readonly [
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
		number,
	] = [2, 0, 1, 1, 1, 2, 2, 2, 2, 2]
	const index = cases[num % 10]
	return forms[index]
}

// число + слово в нужной форме: "5 работ", "21 работа"
export function pluralizeRuWithCount(
	n: number,
	forms: RuForms | readonly [string, string, string],
): string {
	const num = Math.abs(Math.floor(Number(n)))
	const pluForms = (isString(forms) ? ruForms[forms] : forms) ?? []
	return `${num} ${pluralizeRu(num, pluForms)}`
}

// predefined RU forms for pluralizeRuWithCount
type RuForms =
	| 'work'
	| 'skill'
	| 'project'
	| 'order'
	| 'message'
	| 'review'
	| 'notification'
	| 'profile'
	| 'application'
	| 'applications'
const ruForms: Record<RuForms, readonly [string, string, string]> = {
	work: ['работа', 'работы', 'работ'],
	skill: ['навык', 'навыка', 'навыков'],
	project: ['проект', 'проекта', 'проектов'],
	order: ['заказ', 'заказа', 'заказов'],
	message: ['сообщение', 'сообщения', 'сообщений'],
	review: ['отзыв', 'отзыва', 'отзывов'],
	notification: ['уведомление', 'уведомления', 'уведомлений'],
	profile: ['профиль', 'профиля', 'профилей'],
	application: ['заявка', 'заявки', 'заявок'],
	applications: ['заявки', 'заявок', 'заявок'],
}
