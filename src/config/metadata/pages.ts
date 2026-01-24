import { SITE_NAME } from './constants'
import { createMetadata } from './utils'
import type { Metadata } from 'next'

export const homeMetadata: Metadata = createMetadata({
	description:
		'Найдите специалистов по GPT-4, Midjourney, Stable Diffusion и другим инструментам генеративного ИИ. Или начните зарабатывать на своих навыках.',
	path: '/',
})

export const freelancersMetadata: Metadata = createMetadata({
	title: 'Фрилансеры',
	description:
		'Найдите опытных специалистов по генеративному ИИ: prompt-инженеры, AI-художники, специалисты по автоматизации',
	path: '/freelancers',
})

export const projectsMetadata: Metadata = createMetadata({
	title: 'Проекты',
	description:
		'Актуальные проекты и заказы в сфере генеративного ИИ. Найдите интересную работу или закажите выполнение задачи',
	path: '/projects',
})

export const howItWorksMetadata: Metadata = createMetadata({
	title: 'Как это работает',
	description: `Узнайте, как работает платформа ${SITE_NAME}. Инструкции для заказчиков и исполнителей`,
	path: '/how-it-works',
})

export const loginMetadata: Metadata = createMetadata({
	title: 'Вход',
	description: 'Войдите в свой аккаунт NeuroHub',
	path: '/login',
	noIndex: true,
})

export const signupMetadata: Metadata = createMetadata({
	title: 'Регистрация',
	description: 'Создайте аккаунт на платформе NeuroHub',
	path: '/signup',
	noIndex: true,
})

export const postProjectMetadata: Metadata = createMetadata({
	title: 'Разместить проект',
	description: 'Разместите свой проект и найдите специалиста по генеративному ИИ',
	path: '/post-project',
})
