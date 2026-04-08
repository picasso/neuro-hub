'use client'

import { isPlainObject, isString, map } from 'lodash'
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Empty, type EmptyProps } from '../empty'
import { Skeleton } from '../skeleton'
import { Stack } from '../stack'
import { Message, type MessageProps } from './message'
import { useChatScrollContext } from './scroll-context'
import { cn } from '@/utils'

export type MessageItem = { id: string } & MessageProps

export type MessagesProps = {
	items?: MessageItem[]
	theme?: MessageProps['theme']
	loading?: boolean
	error?: string | true | null
	empty?: boolean | Pick<EmptyProps, 'title' | 'desc' | 'children'>
	scrollToMessageId?: string
	className?: string
}

export function Messages({
	items = [],
	theme,
	loading,
	error,
	className,
	empty,
	scrollToMessageId,
}: MessagesProps) {
	const endRef = useRef<HTMLDivElement | null>(null)
	const hasHydratedRef = useRef(false)
	const hasMountedRef = useRef(false)
	const seenMessageIdsRef = useRef(new Set<string>())
	const lastScrolledMessageIdRef = useRef<string | null>(null)
	const scrollContainerRef = useChatScrollContext()
	const enteringMessageIds = useMemo(
		() =>
			hasHydratedRef.current
				? new Set(
						items
							.map(({ id }) => id)
							.filter((id) => !seenMessageIdsRef.current.has(id)),
					)
				: new Set<string>(),
		[items],
	)

	useEffect(() => {
		hasHydratedRef.current = true
		seenMessageIdsRef.current = new Set(items.map(({ id }) => id))
	}, [items])

	useLayoutEffect(() => {
		if (!hasMountedRef.current) {
			hasMountedRef.current = true
			lastScrolledMessageIdRef.current = scrollToMessageId ?? null
			return
		}

		if (!scrollToMessageId || scrollToMessageId === lastScrolledMessageIdRef.current) {
			return
		}

		lastScrolledMessageIdRef.current = scrollToMessageId
		const scrollContainer = scrollContainerRef?.current ?? null

		requestAnimationFrame(() => {
			if (scrollContainer) {
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: 'smooth',
				})
				return
			}

			endRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		})
	}, [scrollContainerRef, scrollToMessageId])

	if (loading) {
		return (
			<div className="m-4">
				<Skeleton shape="chat" slot="chat-message" itemClassName="w-full max-w-[28rem]" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="m-4">
				<Empty
					error
					outline
					mediaIcon
					icon="construction"
					title="Что-то пошло не так!"
					desc={isString(error) ? error : 'Произошла ошибка при загрузке сообщений'}
					className={cn('mx-auto my-8', className)}
					compact
				/>
			</div>
		)
	}

	if (items.length === 0 && empty) {
		const { title, desc, children } = (
			isPlainObject(empty)
				? empty
				: {
						title: 'Пока никаких сообщений нет',
						desc: 'Добавьте первое сообщение, чтобы начать общение...',
						children: undefined,
					}
		) as Exclude<NonNullable<MessagesProps['empty']>, boolean>
		return (
			<div className="m-4">
				<Empty
					outline
					dark
					mediaIcon
					title={title}
					desc={desc}
					icon="messages-square"
					className={cn('mx-auto my-8', className)}
					compact
				>
					{children}
				</Empty>
			</div>
		)
	}

	return (
		<Stack vertical gap={2} align="stretch" data-theme={theme} className={className}>
			{map(items, ({ id, ...msg }) => (
				<Message
					key={id}
					data-message={id}
					theme={theme}
					animateIn={enteringMessageIds.has(id)}
					{...msg}
				/>
			))}
			<div ref={endRef} aria-hidden className="h-px w-full shrink-0" />
		</Stack>
	)
}
