'use client'

import { Chat, type ChatProps } from './chat'
import { Chats, type ChatsProps, type ChatItem } from './chats'
import { ChatComposer, type ChatComposerProps } from './composer'
import { ChatContainer, type ChatContainerProps } from './container'
import { Message, type MessageProps } from './message'
import { type MessageItem, Messages, type MessagesProps } from './messages'
import { Status, type StatusProps } from './status'
import { ChatToolbar, type ChatToolbarProps } from './toolbar'

export const ChatUI = {
	Chats,
	Chat,
	Composer: ChatComposer,
	Container: ChatContainer,
	Toolbar: ChatToolbar,
	Messages,
	Status,
	Message,
}

export type {
	ChatProps as Chat,
	ChatsProps as Chats,
	ChatComposerProps as Composer,
	ChatContainerProps as Container,
	ChatToolbarProps as Toolbar,
	MessagesProps as Messages,
	StatusProps as Status,
	MessageProps as Message,
	ChatItem as Item,
	MessageItem as MessageItem,
}
