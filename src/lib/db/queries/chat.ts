import type {
	ChatConversationOpenData,
	ChatConversationSummary,
	ChatContextType,
	ChatMessage,
	ChatMessagePage,
	ChatParticipantRole,
	ChatParticipantSummary,
	ChatReadState,
} from '@/lib/chat/contracts'
import type {
	ChatConversationListQueryInput,
	ChatCreateConversationInput,
	ChatMarkReadInput,
	ChatMessageListQueryInput,
	ChatSendMessageInput,
} from '@/lib/validations'
import {
	decodeChatMessageCursor,
	encodeChatMessageCursor,
	type ChatMessageCursor,
} from '@/lib/chat/cursor'
import {
	createChatApplicationNotFoundError,
	createChatApplicationRejectedError,
	createChatApplicationWithdrawnError,
	createChatConversationNotFoundError,
	createChatProjectClosedError,
	createChatProjectForbiddenError,
	createChatProjectNotFoundError,
} from '@/lib/chat/errors'
import { kysely } from '@/lib/db'
import { AppError } from '@/utils/errors'

type ListConversationsResult = {
	items: ChatConversationSummary[]
	page: number
	pageSize: number
	total: number
	hasMore: boolean
}

type ProjectEligibility = {
	projectId: string
	customerId: string
	freelancerId: string
}

type ConversationMembership = {
	id: string
	contextType: string
	contextId: string
	customerId: string
	freelancerId: string
}

type MessagePosition = {
	id: string
	createdAt: Date
}

const ACTIVE_APPLICATION_STATUSES = ['submitted', 'shortlisted', 'accepted'] as const
const CHAT_CREATE_ALLOWED_PROJECT_STATUSES = ['published', 'in_progress'] as const

export async function openOrCreateConversationForClient(params: {
	clientId: string
	input: ChatCreateConversationInput
}): Promise<ChatConversationOpenData> {
	const { clientId, input } = params
	const existing = await findConversationByParticipants({
		contextType: input.contextType,
		contextId: input.contextId,
		customerId: clientId,
		freelancerId: input.freelancerId,
	})

	if (existing) {
		const [conversation] = await loadConversationSummariesByIds({
			userId: clientId,
			conversationIds: [existing.id],
		})

		if (!conversation) {
			throw createChatConversationNotFoundError()
		}

		return {
			conversation,
			created: false,
		}
	}

	if (input.contextType !== 'project') {
		throw new AppError('Unsupported chat context type', 400, 'CHAT_CONTEXT_UNSUPPORTED')
	}

	await assertCanOpenProjectConversation({
		projectId: input.contextId,
		customerId: clientId,
		freelancerId: input.freelancerId,
	})

	const conversationId = await kysely.transaction().execute(async (trx) => {
		try {
			const inserted = await trx
				.insertInto('conversations')
				.values({
					context_type: input.contextType,
					context_id: input.contextId,
					customer_id: clientId,
					freelancer_id: input.freelancerId,
					created_by: clientId,
					updated_at: new Date(),
				})
				.returning(['id'])
				.executeTakeFirstOrThrow()

			await trx
				.insertInto('conversation_members')
				.values([
					{
						conversation_id: inserted.id,
						user_id: clientId,
						role: 'customer',
					},
					{
						conversation_id: inserted.id,
						user_id: input.freelancerId,
						role: 'freelancer',
					},
				])
				.execute()

			return inserted.id
		} catch (error) {
			if (isUniqueConstraintError(error)) {
				const concurrentConversation = await findConversationByParticipants({
					contextType: input.contextType,
					contextId: input.contextId,
					customerId: clientId,
					freelancerId: input.freelancerId,
				})

				if (concurrentConversation) {
					return concurrentConversation.id
				}
			}

			throw error
		}
	})

	const [conversation] = await loadConversationSummariesByIds({
		userId: clientId,
		conversationIds: [conversationId],
	})

	if (!conversation) {
		throw createChatConversationNotFoundError()
	}

	return {
		conversation,
		created: true,
	}
}

export async function listConversationsForUser(params: {
	userId: string
	input: ChatConversationListQueryInput
}): Promise<ListConversationsResult> {
	const { userId, input } = params
	const unreadCounts = buildUnreadCountsSubquery(userId)
	let countQuery = kysely
		.selectFrom('conversations as conversation')
		.innerJoin('conversation_members as member', (join) =>
			join
				.onRef('member.conversation_id', '=', 'conversation.id')
				.on('member.user_id', '=', userId),
		)
		.leftJoin(unreadCounts, 'unread_counts.conversationId', 'conversation.id')
		.select((eb) => eb.fn.countAll().as('count'))

	let idsQuery = kysely
		.selectFrom('conversations as conversation')
		.innerJoin('conversation_members as member', (join) =>
			join
				.onRef('member.conversation_id', '=', 'conversation.id')
				.on('member.user_id', '=', userId),
		)
		.leftJoin(unreadCounts, 'unread_counts.conversationId', 'conversation.id')
		.select(['conversation.id as id'])

	if (input.contextType) {
		countQuery = countQuery.where('conversation.context_type', '=', input.contextType)
		idsQuery = idsQuery.where('conversation.context_type', '=', input.contextType)
	}

	if (input.contextId) {
		countQuery = countQuery.where('conversation.context_id', '=', input.contextId)
		idsQuery = idsQuery.where('conversation.context_id', '=', input.contextId)
	}

	if (input.unreadOnly) {
		countQuery = countQuery.where('unread_counts.conversationId', 'is not', null)
		idsQuery = idsQuery.where('unread_counts.conversationId', 'is not', null)
	}

	const offset = (input.page - 1) * input.pageSize
	const countResult = await countQuery.executeTakeFirstOrThrow()
	const total = Number(countResult.count)
	const pagedIds = await idsQuery
		.orderBy('conversation.updated_at', 'desc')
		.orderBy('conversation.id', 'desc')
		.limit(input.pageSize)
		.offset(offset)
		.execute()

	const conversationIds = pagedIds.map((item) => item.id)
	const items = await loadConversationSummariesByIds({
		userId,
		conversationIds,
	})

	return {
		items,
		page: input.page,
		pageSize: input.pageSize,
		total,
		hasMore: offset + items.length < total,
	}
}

export async function listMessagesForUser(params: {
	userId: string
	conversationId: string
	input: ChatMessageListQueryInput
}): Promise<ChatMessagePage> {
	const { userId, conversationId, input } = params

	await requireConversationMembership({
		userId,
		conversationId,
	})

	let query = kysely
		.selectFrom('messages as message')
		.select([
			'message.id as id',
			'message.conversation_id as conversationId',
			'message.sender_id as senderId',
			'message.text as text',
			'message.created_at as createdAt',
		])
		.where('message.conversation_id', '=', conversationId)

	if (input.cursor) {
		const cursor = decodeChatMessageCursor(input.cursor)
		const cursorDate = new Date(cursor.createdAt)

		query = query.where((eb) =>
			eb.or([
				eb('message.created_at', '<', cursorDate),
				eb.and([
					eb('message.created_at', '=', cursorDate),
					eb('message.id', '<', cursor.messageId),
				]),
			]),
		)
	}

	const rows = await query
		.orderBy('message.created_at', 'desc')
		.orderBy('message.id', 'desc')
		.limit(input.limit + 1)
		.execute()

	const hasMore = rows.length > input.limit
	const sliced = hasMore ? rows.slice(0, input.limit) : rows
	const items = sliced.map(mapMessageRowToChatMessage).reverse()
	const nextCursor =
		hasMore && items.length > 0
			? encodeChatMessageCursor({
					createdAt: items[0].createdAt,
					messageId: items[0].id,
				})
			: null

	return {
		items,
		nextCursor,
	}
}

export async function sendMessageInConversation(params: {
	userId: string
	conversationId: string
	input: ChatSendMessageInput
}): Promise<ChatMessage> {
	const { userId, conversationId, input } = params

	await requireConversationMembership({
		userId,
		conversationId,
	})

	return kysely.transaction().execute(async (trx) => {
		const createdAt = new Date()
		const inserted = await trx
			.insertInto('messages')
			.values({
				conversation_id: conversationId,
				sender_id: userId,
				text: input.text,
				created_at: createdAt,
			})
			.returning([
				'id',
				'conversation_id as conversationId',
				'sender_id as senderId',
				'text',
				'created_at as createdAt',
			])
			.executeTakeFirstOrThrow()

		await trx
			.updateTable('conversations')
			.set({
				updated_at: createdAt,
			})
			.where('id', '=', conversationId)
			.execute()

		return mapMessageRowToChatMessage(inserted)
	})
}

export async function markConversationReadForUser(params: {
	userId: string
	conversationId: string
	input: ChatMarkReadInput
}): Promise<{ readState: ChatReadState; changed: boolean }> {
	const { userId, conversationId, input } = params

	await requireConversationMembership({
		userId,
		conversationId,
	})

	return kysely.transaction().execute(async (trx) => {
		const targetMessage = await trx
			.selectFrom('messages')
			.select(['id', 'created_at'])
			.where('conversation_id', '=', conversationId)
			.where('id', '=', input.lastReadMessageId)
			.executeTakeFirst()

		if (!targetMessage) {
			throw new AppError('Message not found', 404, 'CHAT_MESSAGE_NOT_FOUND')
		}

		const currentState = await trx
			.selectFrom('message_reads')
			.select([
				'id',
				'last_read_message_id as lastReadMessageId',
				'last_read_message_created_at as lastReadMessageCreatedAt',
				'read_at as readAt',
			])
			.where('conversation_id', '=', conversationId)
			.where('user_id', '=', userId)
			.executeTakeFirst()

		const targetPosition: MessagePosition = {
			id: targetMessage.id,
			createdAt: requireDate(targetMessage.created_at),
		}

		if (currentState) {
			const currentPosition: MessagePosition = {
				id: currentState.lastReadMessageId,
				createdAt: currentState.lastReadMessageCreatedAt,
			}

			if (compareMessagePositions(targetPosition, currentPosition) <= 0) {
				return {
					readState: {
						conversationId,
						lastReadMessageId: currentState.lastReadMessageId,
						readAt: currentState.readAt.toISOString(),
					},
					changed: false,
				}
			}
		}

		const readAt = new Date()

		if (currentState) {
			await trx
				.updateTable('message_reads')
				.set({
					last_read_message_id: targetMessage.id,
					last_read_message_created_at: requireDate(targetMessage.created_at),
					read_at: readAt,
					updated_at: readAt,
				})
				.where('id', '=', currentState.id)
				.execute()
		} else {
			await trx
				.insertInto('message_reads')
				.values({
					conversation_id: conversationId,
					user_id: userId,
					last_read_message_id: targetMessage.id,
					last_read_message_created_at: requireDate(targetMessage.created_at),
					read_at: readAt,
					updated_at: readAt,
				})
				.execute()
		}

		return {
			readState: {
				conversationId,
				lastReadMessageId: targetMessage.id,
				readAt: readAt.toISOString(),
			},
			changed: true,
		}
	})
}

export async function ensureConversationAccess(params: { userId: string; conversationId: string }) {
	await requireConversationMembership(params)
}

async function loadConversationSummariesByIds(params: {
	userId: string
	conversationIds: string[]
}): Promise<ChatConversationSummary[]> {
	const { userId, conversationIds } = params

	if (conversationIds.length === 0) {
		return []
	}

	const unreadCounts = buildUnreadCountsSubquery(userId)
	const lastMessages = buildLastMessagesSubquery()
	const rows = await kysely
		.selectFrom('conversations as conversation')
		.innerJoin('conversation_members as member', (join) =>
			join
				.onRef('member.conversation_id', '=', 'conversation.id')
				.on('member.user_id', '=', userId),
		)
		.innerJoin('users as customer_user', 'customer_user.id', 'conversation.customer_id')
		.leftJoin(
			'user_profiles as customer_profile',
			'customer_profile.user_id',
			'conversation.customer_id',
		)
		.innerJoin('users as freelancer_user', 'freelancer_user.id', 'conversation.freelancer_id')
		.leftJoin(
			'user_profiles as freelancer_profile',
			'freelancer_profile.user_id',
			'conversation.freelancer_id',
		)
		.leftJoin('message_reads as read_state', (join) =>
			join
				.onRef('read_state.conversation_id', '=', 'conversation.id')
				.on('read_state.user_id', '=', userId),
		)
		.leftJoin(unreadCounts, 'unread_counts.conversationId', 'conversation.id')
		.leftJoin(lastMessages, 'last_message.conversationId', 'conversation.id')
		.select([
			'conversation.id as id',
			'conversation.context_type as contextType',
			'conversation.context_id as contextId',
			'conversation.created_at as createdAt',
			'conversation.updated_at as updatedAt',
			'conversation.customer_id as customerId',
			'conversation.freelancer_id as freelancerId',
			'customer_user.name as customerName',
			'customer_user.image as customerImage',
			'customer_profile.name as customerProfileName',
			'customer_profile.avatar_url as customerAvatarUrl',
			'freelancer_user.name as freelancerName',
			'freelancer_user.image as freelancerImage',
			'freelancer_profile.name as freelancerProfileName',
			'freelancer_profile.avatar_url as freelancerAvatarUrl',
			'read_state.last_read_message_id as lastReadMessageId',
			'read_state.read_at as lastReadAt',
			'unread_counts.unreadCount as unreadCount',
			'last_message.id as lastMessageId',
			'last_message.senderId as lastMessageSenderId',
			'last_message.text as lastMessageText',
			'last_message.createdAt as lastMessageCreatedAt',
		])
		.where('conversation.id', 'in', conversationIds)
		.execute()

	const summaryById = new Map(
		rows.map((row) => [row.id, mapConversationRowToSummary(row, userId)]),
	)
	return conversationIds
		.map((conversationId) => summaryById.get(conversationId))
		.filter((item): item is ChatConversationSummary => !!item)
}

async function requireConversationMembership(params: {
	userId: string
	conversationId: string
}): Promise<ConversationMembership> {
	const membership = await kysely
		.selectFrom('conversations as conversation')
		.innerJoin('conversation_members as member', (join) =>
			join
				.onRef('member.conversation_id', '=', 'conversation.id')
				.on('member.user_id', '=', params.userId),
		)
		.select([
			'conversation.id as id',
			'conversation.context_type as contextType',
			'conversation.context_id as contextId',
			'conversation.customer_id as customerId',
			'conversation.freelancer_id as freelancerId',
		])
		.where('conversation.id', '=', params.conversationId)
		.executeTakeFirst()

	if (!membership) {
		throw createChatConversationNotFoundError()
	}

	return membership
}

async function findConversationByParticipants(params: {
	contextType: ChatContextType
	contextId: string
	customerId: string
	freelancerId: string
}) {
	return kysely
		.selectFrom('conversations')
		.select(['id'])
		.where('context_type', '=', params.contextType)
		.where('context_id', '=', params.contextId)
		.where('customer_id', '=', params.customerId)
		.where('freelancer_id', '=', params.freelancerId)
		.executeTakeFirst()
}

async function assertCanOpenProjectConversation(params: ProjectEligibility) {
	const project = await kysely
		.selectFrom('projects')
		.select(['id', 'client_id', 'status'])
		.where('id', '=', params.projectId)
		.executeTakeFirst()

	if (!project) {
		throw createChatProjectNotFoundError()
	}

	if (project.client_id !== params.customerId) {
		throw createChatProjectForbiddenError()
	}

	if (
		!CHAT_CREATE_ALLOWED_PROJECT_STATUSES.includes(
			project.status as (typeof CHAT_CREATE_ALLOWED_PROJECT_STATUSES)[number],
		)
	) {
		throw createChatProjectClosedError()
	}

	const application = await kysely
		.selectFrom('applications')
		.select(['id', 'status'])
		.where('project_id', '=', params.projectId)
		.where('freelancer_id', '=', params.freelancerId)
		.executeTakeFirst()

	if (!application) {
		throw createChatApplicationNotFoundError()
	}

	if (application.status === 'withdrawn') {
		throw createChatApplicationWithdrawnError()
	}

	if (application.status === 'rejected') {
		throw createChatApplicationRejectedError()
	}

	if (
		!ACTIVE_APPLICATION_STATUSES.includes(
			application.status as (typeof ACTIVE_APPLICATION_STATUSES)[number],
		)
	) {
		throw createChatApplicationNotFoundError()
	}
}

function buildUnreadCountsSubquery(userId: string) {
	return kysely
		.selectFrom('messages as message')
		.leftJoin('message_reads as read_state', (join) =>
			join
				.onRef('read_state.conversation_id', '=', 'message.conversation_id')
				.on('read_state.user_id', '=', userId),
		)
		.select(['message.conversation_id as conversationId'])
		.select((eb) => eb.fn.countAll().as('unreadCount'))
		.where('message.sender_id', '!=', userId)
		.where((eb) =>
			eb.or([
				eb('read_state.id', 'is', null),
				eb('message.created_at', '>', eb.ref('read_state.last_read_message_created_at')),
				eb.and([
					eb(
						'message.created_at',
						'=',
						eb.ref('read_state.last_read_message_created_at'),
					),
					eb('message.id', '>', eb.ref('read_state.last_read_message_id')),
				]),
			]),
		)
		.groupBy('message.conversation_id')
		.as('unread_counts')
}

function buildLastMessagesSubquery() {
	return kysely
		.selectFrom('messages as message')
		.distinctOn('message.conversation_id')
		.select([
			'message.conversation_id as conversationId',
			'message.id as id',
			'message.sender_id as senderId',
			'message.text as text',
			'message.created_at as createdAt',
		])
		.orderBy('message.conversation_id')
		.orderBy('message.created_at', 'desc')
		.orderBy('message.id', 'desc')
		.as('last_message')
}

function mapConversationRowToSummary(
	row: {
		id: string
		contextType: string
		contextId: string
		createdAt: Date | null
		updatedAt: Date | null
		customerId: string
		freelancerId: string
		customerName: string
		customerImage: string | null
		customerProfileName: string | null
		customerAvatarUrl: string | null
		freelancerName: string
		freelancerImage: string | null
		freelancerProfileName: string | null
		freelancerAvatarUrl: string | null
		lastReadMessageId: string | null
		lastReadAt: Date | null
		unreadCount: number | string | bigint | null
		lastMessageId: string | null
		lastMessageSenderId: string | null
		lastMessageText: string | null
		lastMessageCreatedAt: Date | null
	},
	userId: string,
): ChatConversationSummary {
	const otherParticipant =
		row.customerId === userId
			? createParticipantSummary({
					id: row.freelancerId,
					name: row.freelancerProfileName ?? row.freelancerName,
					image: row.freelancerAvatarUrl ?? row.freelancerImage,
					role: 'freelancer',
				})
			: createParticipantSummary({
					id: row.customerId,
					name: row.customerProfileName ?? row.customerName,
					image: row.customerAvatarUrl ?? row.customerImage,
					role: 'customer',
				})

	return {
		id: row.id,
		contextType: row.contextType as ChatContextType,
		contextId: row.contextId,
		createdAt: toIsoString(row.createdAt),
		updatedAt: toIsoString(row.updatedAt),
		otherParticipant,
		lastMessage:
			row.lastMessageId &&
			row.lastMessageSenderId &&
			row.lastMessageText &&
			row.lastMessageCreatedAt
				? {
						id: row.lastMessageId,
						senderId: row.lastMessageSenderId,
						text: row.lastMessageText,
						createdAt: row.lastMessageCreatedAt.toISOString(),
					}
				: null,
		unreadCount: Number(row.unreadCount ?? 0),
		lastReadMessageId: row.lastReadMessageId,
		lastReadAt: row.lastReadAt ? row.lastReadAt.toISOString() : null,
	}
}

function createParticipantSummary(input: {
	id: string
	name: string
	image: string | null
	role: ChatParticipantRole
}): ChatParticipantSummary {
	return {
		id: input.id,
		name: input.name,
		image: input.image,
		role: input.role,
	}
}

function mapMessageRowToChatMessage(row: {
	id: string
	conversationId: string
	senderId: string
	text: string
	createdAt: Date | null
}): ChatMessage {
	return {
		id: row.id,
		conversationId: row.conversationId,
		senderId: row.senderId,
		text: row.text,
		createdAt: toIsoString(row.createdAt),
	}
}

function compareMessagePositions(left: MessagePosition, right: MessagePosition) {
	const timestampDiff = left.createdAt.getTime() - right.createdAt.getTime()

	if (timestampDiff !== 0) {
		return timestampDiff
	}

	return left.id.localeCompare(right.id)
}

function toIsoString(value: Date | null) {
	return (value ?? new Date(0)).toISOString()
}

function requireDate(value: Date | null) {
	return value ?? new Date(0)
}

function isUniqueConstraintError(error: unknown) {
	return (
		error instanceof Error &&
		'code' in error &&
		typeof error.code === 'string' &&
		error.code === '23505'
	)
}

export type { ListConversationsResult, ChatMessageCursor, ConversationMembership }
