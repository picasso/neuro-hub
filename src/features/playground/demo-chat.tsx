'use client'

import dayjs from 'dayjs'
import { random } from 'lodash'
import { useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type ChatDemoState } from './demo-chat-settings'
import { useSettings } from './settings-store'
import {
	Chats,
	type ChatsProps,
	ChatComposer,
	ChatContainer,
	Message,
	Messages,
	type MessagesProps,
	Stack,
	ChatStatus,
	type TabItem,
	Tabs,
	TS,
	type ChatContainerProps,
} from '@/ui'

export function DemoChat() {
	const {
		messageTheme,
		composerDisabled,
		composerSubmitting,
		showComposerCounter,
		stickyHeader,
		stickyFooter,
		limitWidth,
		limitHeight,
		padding,
		background,
		bordered,
		withTail,
	} = useSettings<ChatDemoState>()
	const [draft, setDraft] = useState('')
	const [activeChatId, setActiveChatId] = useState<string | null>(null)

	const messageTabs = messagesItems({
		theme: messageTheme,
		stickyHeader,
		stickyFooter,
		limitWidth,
		limitHeight,
		padding,
		background,
		bordered,
	})

	const chatTabs = chatItems({
		stickyHeader,
		stickyFooter,
		limitWidth,
		limitHeight,
		padding,
		background,
		bordered,
		onSelect: setActiveChatId,
		activeId: activeChatId,
	})

	return (
		<DemoRoot>
			<DemoSection
				title="Message"
				desc="Набор `?Chat` компонет на базе **shadcn** -> support for different themes and statuses. `in` and `out` have different corners and background colors"
				separator
			>
				<Stack vertical gap={4} align="stretch" className="max-w-lg">
					<Message {...messageMocks.in} theme={messageTheme} withTail={withTail} />
					<Message
						{...messageMocks.out}
						delivery="sent"
						theme={messageTheme}
						withTail={withTail}
					/>
					<Message
						{...messageMocks.out}
						text="Отправка…"
						delivery="sending"
						timestamp={mockTime('today')}
						theme={messageTheme}
						withTail={withTail}
					/>
					<Message
						{...messageMocks.out}
						text="Ошибка сети"
						delivery="failed"
						timestamp={mockTime('weeks')}
						theme={messageTheme}
						withTail={withTail}
					/>
					<Message
						{...messageMocks.out}
						text="Прочитано"
						read
						timestamp={mockTime('old')}
						theme={messageTheme}
						withTail={withTail}
					/>
				</Stack>
			</DemoSection>

			<DemoSection
				title="Status"
				desc="delivery states with possible tooltip in `Message`"
				separator
			>
				<Stack direction="row" gap={3} align="center" wrap>
					<Stack vertical gap={1} align="center">
						<ChatStatus status="loading" />
						<TS variant="caption" color="secondary" content="loading" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatStatus status="sending" />
						<TS variant="caption" color="secondary" content="sending" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatStatus status="failed" />
						<TS variant="caption" color="secondary" content="failed" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatStatus status="sent" />
						<TS variant="caption" color="secondary" content="sent" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatStatus status="read" tooltip="Your message has been read" />
						<TS variant="caption" color="secondary" content="read + tooltip" />
					</Stack>
				</Stack>
			</DemoSection>

			<DemoSection
				title="Messages"
				desc="Различные состояния: **List / Loading / Error / Empty**"
				separator
			>
				<Tabs bordered fullWidth size="sm" items={messageTabs} />
			</DemoSection>
			<DemoSection
				title="Chats"
				desc="Различные состояния: **List / Loading / Error / Empty**"
				separator
			>
				<Tabs bordered fullWidth size="sm" items={chatTabs} />
			</DemoSection>

			<DemoSection
				title="Composer"
				desc="Счётчик символов — опционально (настройка справа)."
				separator
			>
				<ChatComposer
					placeholder="Введите какой-нибудь текст…"
					value={draft}
					onChange={setDraft}
					onSubmit={() => setDraft('')}
					disabled={composerDisabled}
					isSubmitting={composerSubmitting}
					maxLength={2000}
					counter={showComposerCounter}
				/>
			</DemoSection>
		</DemoRoot>
	)
}

const mockTime = (
	when: 'today' | 'yesterday' | 'recent' | 'weeks' | 'old' | 'random' = 'random',
) => {
	if (when === 'today') return dayjs().utc().toISOString()
	if (when === 'yesterday') return dayjs().subtract(1, 'day').utc().toISOString()
	if (when === 'recent') return dayjs().subtract(random(2, 6), 'days').utc().toISOString()
	if (when === 'weeks') return dayjs().subtract(random(7, 100), 'days').utc().toISOString()
	if (when === 'old') return dayjs().subtract(random(340, 400), 'days').utc().toISOString()
	return dayjs().subtract(random(0, 14), 'days').utc().toISOString()
}

const messageMocks = {
	in: {
		direction: 'in' as const,
		text: 'Привет! Это входящее сообщение с нейтральной bubble.',
		timestamp: mockTime('recent'),
	},
	out: {
		direction: 'out' as const,
		text: 'Исходящее: pale primary, время + статус справа.',
		timestamp: mockTime('yesterday'),
	},
}

const containerScrollMessages = Array.from({ length: 28 }, (_, i) => {
	const direction = (['in', 'out'] as const)[i % 2]
	return {
		id: `scroll-${i}`,
		direction,
		text: `Сообщение ${i + 1}. Небольшой текст для проверки прокрутки области треда.`,
		timestamp: mockTime(),
		...(direction === 'out' ? { delivery: 'sent' as const } : {}),
	}
})

const chatRows = [
	{
		id: 'a',
		name: 'Команда NeuroGig',
		lastMessage: 'Короткий превью-текст',
		updatedAt: mockTime('yesterday'),
		unreadCount: 3,
	},
	{
		id: 'b',
		name: 'Длинное имя чата для проверки обрезки и выравнивания',
		lastMessage:
			'Очень длинный последний текст сообщения, который должен аккуратно обрезаться с многоточием в списке',
		updatedAt: mockTime('recent'),
		unreadCount: 0,
	},
	{
		id: 'c',
		avatar: 'https://avatars.githubusercontent.com/u/399395',
		name: 'Димон Отстань от меня',
		lastMessage:
			'Очень длинный последний текст сообщения, который должен аккуратно обрезаться с многоточием в списке',
		updatedAt: mockTime('weeks'),
		unreadCount: 200,
	},
	{
		id: 'd',
		name: 'Без непрочитанных',
		lastMessage: 'Ок',
		updatedAt: mockTime('today'),
		unreadCount: 0,
	},
]

type Options = Pick<
	ChatContainerProps,
	| 'limitWidth'
	| 'limitHeight'
	| 'stickyHeader'
	| 'stickyFooter'
	| 'padding'
	| 'background'
	| 'bordered'
> & {
	theme?: ChatDemoState['messageTheme']
	onSelect?: ChatsProps['onSelect']
	activeId?: ChatsProps['activeId']
}

// const chatContent = (props: Partial<ChatsProps>) => {
// 	return (
// 		<div className="overflow-hidden">
// 			<Chats {...props} />
// 		</div>
// 	)
// }

// const chatItems: TabItem[] = [
// 	{
// 		value: 'list',
// 		title: 'List',
// 		icon: 'collections',
// 		content: chatContent({ items: chatRows, activeId: 'a' }),
// 	},
// 	{
// 		value: 'loading',
// 		title: 'Loading',
// 		icon: 'loader-pinwheel',
// 		content: chatContent({ loading: true }),
// 	},
// 	{
// 		value: 'error',
// 		title: 'Error',
// 		icon: 'circle-alert',
// 		content: chatContent({ error: true }),
// 	},
// 	{
// 		value: 'empty',
// 		title: 'Empty',
// 		icon: 'code',
// 		content: chatContent({}),
// 	},
// ]

const messageContent = (options: Options, props: Partial<MessagesProps>) => {
	return (
		<ChatContainer
			header={`Messages${options.stickyHeader ? ' sticky' : ''} header`}
			footer={`Messages${options.stickyFooter ? ' sticky' : ''} footer`}
			{...options}
			className="m-4"
		>
			<Messages theme={options.theme} {...props} />
		</ChatContainer>
	)
}

const messagesItems = (options: Options) =>
	[
		{
			value: 'list',
			title: 'List',
			icon: 'collections',
			content: messageContent(options, { items: containerScrollMessages }),
		},
		{
			value: 'loading',
			title: 'Loading',
			icon: 'loader-pinwheel',
			content: messageContent(options, { loading: true }),
		},
		{
			value: 'error',
			title: 'Error',
			icon: 'circle-alert',
			content: messageContent(options, { error: true }),
		},
		{
			value: 'empty',
			title: 'Empty',
			icon: 'code',
			content: messageContent(options, { empty: true }),
		},
	] as TabItem[]

const chatContent = (options: Options, props: Partial<ChatsProps>) => {
	return (
		<ChatContainer
			header={`Chats${options.stickyHeader ? ' sticky' : ''} header`}
			footer={`Chats${options.stickyFooter ? ' sticky' : ''} footer`}
			{...options}
			className="m-4"
		>
			<Chats {...props} onSelect={options.onSelect} activeId={options.activeId} />
		</ChatContainer>
	)
}

const chatItems = (options: Options) =>
	[
		{
			value: 'list',
			title: 'List',
			icon: 'collections',
			content: chatContent(options, { items: chatRows }),
		},
		{
			value: 'loading',
			title: 'Loading',
			icon: 'loader-pinwheel',
			content: chatContent(options, { loading: true }),
		},
		{
			value: 'error',
			title: 'Error',
			icon: 'circle-alert',
			content: chatContent(options, { error: true }),
		},
		{
			value: 'empty',
			title: 'Empty',
			icon: 'code',
			content: chatContent(options, { empty: true }),
		},
	] as TabItem[]
