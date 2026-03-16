export const freelancerCatalogMock = {
	title: 'Фрилансеры для AI Art & Prompt Design',
	description:
		'Подберите специалистов по Midjourney, Stable Diffusion, Flux и prompt engineering для визуальных концептов, генерации ассетов и AI-first production.',
	breadcrumb: [
		['Фрилансеры', '/freelancers'],
		['Graphics & Design', '/freelancers?category=image_generation'],
		'AI Artists & Prompt Experts',
	] as Array<string | [string, string]>,
	skillLine: [
		{ label: 'Midjourney', query: 'Midjourney' },
		{ label: 'Stable Diffusion', query: 'Stable Diffusion' },
		{ label: 'Flux', query: 'Flux' },
		{ label: 'Prompt Engineering', query: 'Prompt Engineering' },
		{ label: 'Creative Direction', query: 'Creative Direction' },
	],
	categories: [
		{ label: 'All', value: undefined },
		{ label: 'AI Art', value: 'image_generation' },
		{ label: 'Prompting', value: 'text_generation' },
		{ label: 'Video', value: 'video_generation' },
		{ label: 'Automation', value: 'programming' },
		{ label: 'Consulting', value: 'consulting' },
	],
} as const
