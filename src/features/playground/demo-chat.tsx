'use client'

import { useMemo, useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type ChatDemoState } from './demo-chat-settings'
import { imageUrls, text } from './mock'
import {
	createChatRows,
	createMessagePair,
	createScrollMessages,
	getNextConnectionStatus,
	getTime,
	type ConnectionStatus,
} from './mock-generators'
import { useSettings } from './settings-store'
import { ChatUI, type ChatUIProps, Stack, type TabItem, Tabs, TS } from '@/ui'

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
		toolbar,
		toolbarBack,
		toolbarTitle,
		toolbarDesc,
		toolbarReload,
		toolbarStatus,
	} = useSettings<ChatDemoState>()
	const [draft, setDraft] = useState('')
	const [activeChatId, setActiveChatId] = useState<string | null>(null)
	const [status, setStatus] = useState<ConnectionStatus>('connecting')
	const messageMocks = useMemo(() => createMessagePair(), [])
	const containerScrollMessages = useMemo(() => createScrollMessages(), [])
	const chatRows = useMemo(
		() =>
			createChatRows({ avatarUrl: imageUrls.avatar }) as NonNullable<
				ChatUIProps.Chats['items']
			>,
		[],
	)

	const reload = toolbarReload
		? () => setStatus((prev) => getNextConnectionStatus(prev))
		: undefined
	const activeChat = chatRows.find(({ id }) => id === activeChatId)
	const messageTabs = getMessageItems(
		{
			theme: messageTheme,
			stickyHeader,
			stickyFooter,
			limitWidth,
			limitHeight,
			padding,
			background,
			bordered,
			toolbar,
			toolbarBack,
			title: toolbarTitle,
			desc: toolbarDesc,
			reload,
			status: toolbarStatus ? status : undefined,
		},
		containerScrollMessages,
	)

	const chatTabs = getChatItems(
		{
			stickyHeader,
			stickyFooter,
			limitWidth,
			limitHeight,
			padding,
			background,
			bordered,
			onSelect: setActiveChatId,
			activeId: activeChatId,
			toolbar,
			toolbarBack,
			title: toolbarTitle,
			desc: toolbarDesc,
			reload,
			status: toolbarStatus ? status : undefined,
			avatarName: activeChat?.name,
			avatarSrc: activeChat?.image,
		},
		chatRows,
	)

	return (
		<DemoRoot>
			<DemoSection
				title="Message"
				desc="Набор `?Chat` компонет на базе **shadcn** -> support for different themes and statuses. `in` and `out` have different corners and background colors"
				separator
			>
				<Stack vertical gap={4} align="stretch" className="max-w-lg">
					<ChatUI.Message {...messageMocks.in} theme={messageTheme} withTail={withTail} />
					<ChatUI.Message
						{...messageMocks.out}
						status="sent"
						theme={messageTheme}
						withTail={withTail}
					/>
					<ChatUI.Message
						{...messageMocks.out}
						text="Отправка…"
						status="sending"
						createdAt={getTime('today')}
						theme={messageTheme}
						withTail={withTail}
					/>
					<ChatUI.Message
						{...messageMocks.out}
						text="Ошибка сети"
						status="failed"
						createdAt={getTime('weeks')}
						theme={messageTheme}
						withTail={withTail}
					/>
					<ChatUI.Message
						{...messageMocks.out}
						text={draft || 'Прочитано'}
						read
						createdAt={getTime('old')}
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
						<ChatUI.Status status="loading" />
						<TS variant="caption" color="secondary" content="loading" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatUI.Status status="sending" />
						<TS variant="caption" color="secondary" content="sending" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatUI.Status status="failed" />
						<TS variant="caption" color="secondary" content="failed" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatUI.Status status="sent" />
						<TS variant="caption" color="secondary" content="sent" />
					</Stack>
					<Stack vertical gap={1} align="center">
						<ChatUI.Status status="read" tooltip="Your message has been read" />
						<TS variant="caption" color="secondary" content="read + tooltip" />
					</Stack>
				</Stack>
			</DemoSection>

			<DemoSection title="Messages" desc={text.desc.states} separator>
				<Tabs bordered fullWidth size="sm" items={messageTabs} />
			</DemoSection>
			<DemoSection title="Chats" desc={text.desc.states} separator>
				<Tabs bordered fullWidth size="sm" items={chatTabs} />
			</DemoSection>

			<DemoSection
				title="Composer"
				desc="Счётчик символов — опционально (настройка справа)."
				separator
			>
				<ChatUI.Composer
					placeholder={text.placeholder.composer}
					onSubmit={setDraft}
					disabled={composerDisabled}
					isSubmitting={composerSubmitting}
					maxLength={2000}
					counter={showComposerCounter}
				/>
			</DemoSection>
		</DemoRoot>
	)
}
type Options = Pick<
	ChatUIProps.Container,
	| 'limitWidth'
	| 'limitHeight'
	| 'stickyHeader'
	| 'stickyFooter'
	| 'padding'
	| 'background'
	| 'bordered'
> & {
	theme?: ChatDemoState['messageTheme']
	onSelect?: ChatUIProps.Chats['onSelect']
	activeId?: ChatUIProps.Chats['activeId']
	avatarName?: string
	avatarSrc?: string
	toolbar?: boolean
	toolbarBack?: boolean
	title?: boolean
	desc?: boolean
	reload?: () => void
	status?: ConnectionStatus | null
}

function messageContent(options: Options, props: Partial<ChatUIProps.Messages>) {
	const title = `Messages${options.stickyHeader ? ' sticky' : ''} header`
	const header = options.toolbar ? (
		<ChatUI.Toolbar
			back={options.toolbarBack}
			title={options.title ? title : undefined}
			desc={options.desc ? text.desc.toolbar : undefined}
			onReload={options.reload}
			status={options.status}
		/>
	) : (
		title
	)
	return (
		<ChatUI.Container
			header={header}
			footer={`Messages${options.stickyFooter ? ' sticky' : ''} footer`}
			{...options}
			className="m-4"
		>
			<ChatUI.Messages theme={options.theme} {...props} />
		</ChatUI.Container>
	)
}

function getMessageItems(options: Options, items: NonNullable<ChatUIProps.Messages['items']>) {
	return [
		{
			value: 'list',
			title: 'List',
			icon: 'collections',
			content: messageContent(options, { items }),
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
}

function chatContent(options: Options, props: Partial<ChatUIProps.Chats>) {
	const title = `Chats${options.stickyHeader ? ' sticky' : ''} header`
	const header = options.toolbar ? (
		<ChatUI.Toolbar
			back={options.toolbarBack}
			avatar={options.title}
			avatarSrc={options?.avatarSrc}
			title={options.title ? options?.avatarName : undefined}
			onReload={options.reload}
			status={options.status}
		/>
	) : (
		title
	)
	return (
		<ChatUI.Container
			header={header}
			footer={`Chats${options.stickyFooter ? ' sticky' : ''} footer`}
			{...options}
			className="m-4"
		>
			<ChatUI.Chats {...props} onSelect={options.onSelect} activeId={options.activeId} />
		</ChatUI.Container>
	)
}

function getChatItems(options: Options, items: NonNullable<ChatUIProps.Chats['items']>) {
	return [
		{
			value: 'list',
			title: 'List',
			icon: 'collections',
			content: chatContent(options, { items }),
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
}
