import { map, startCase } from 'lodash'
import { type PublicUserLanguage } from '@/lib/db/queries/public-user-languages'
import {
	Avatar,
	Card,
	Empty,
	Icon,
	type IconName,
	Stack,
	StackSpan,
	type TextStyledProps,
	TS,
} from '@/ui'
import { sprintf } from '@/utils'

type HeroCardProps = {
	isClient?: boolean
	full?: boolean
	forcedBio?: boolean
	name: string
	nickname: string
	headline: string | null
	avatarUrl: string | null
	location: string | null
	languages: PublicUserLanguage[] | null
	bio: string | null
}

export function PersonCardHero({
	isClient,
	full,
	forcedBio,
	name,
	nickname,
	headline,
	avatarUrl,
	location,
	languages,
	bio,
}: HeroCardProps) {
	return (
		<Stack gap={full ? 8 : 0} vertical>
			<Stack gap={8} className="w-full">
				<Avatar size="editor" color="auto" name={name} src={avatarUrl} />
				<Stack gap={3} vertical align="start">
					<Stack gap={4}>
						<HeroRecord variant="h4" content={name} />
						<HeroRecord
							variant="subtitle"
							content={nickname}
							template="@%s"
							color="dimmed"
						/>
					</Stack>
					<HeroRecord
						variant="subtitle"
						color="secondary"
						content={headline ? startCase(headline) : ''}
						icon={isClient ? 'building' : 'brain-circuit'}
					/>
					<Stack gap={4} align="start">
						<HeroRecord hideEmpty variant="caption" content={location} icon="map-pin" />
						<HeroRecord
							hideEmpty
							variant="caption"
							content={map(languages, 'name').join(', ')}
							icon="languages"
						/>
					</Stack>
				</Stack>
			</Stack>
			{full && (bio || forcedBio) && (
				<Card
					fullWidth
					size="default"
					gap="none"
					title="О себе"
					contentClassName="text-muted-foreground"
				>
					{bio ?? (
						<Empty
							outline
							compact
							fullWidth
							dark
							align="start"
							title="Описание пока не добавлено"
							helper="Пользователь еще не заполнил публичный блок с рассказом о себе."
						/>
					)}
				</Card>
			)}
		</Stack>
	)
}

type HeroRecordProps = {
	hideEmpty?: boolean
	variant: TextStyledProps['variant']
	content: string | null
	color?: TextStyledProps['color']
	template?: string
	icon?: IconName
	className?: string
}

function HeroRecord({
	hideEmpty,
	variant,
	color,
	content,
	template,
	icon,
	className,
}: HeroRecordProps) {
	if (hideEmpty && !content) return null
	return (
		<StackSpan gap={1} className={className} align="start">
			<StackSpan gap={1}>
				{icon && (
					<Icon
						size={variant === 'subtitle' || variant === 'caption' ? 'xs' : 'sm'}
						name={icon}
					/>
				)}
				<TS
					clean
					variant={variant}
					color={color}
					content={template && content ? sprintf(template, content) : (content ?? '')}
				/>
			</StackSpan>
		</StackSpan>
	)
}
