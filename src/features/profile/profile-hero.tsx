import { useUnit } from 'effector-react'
import { includes } from 'lodash'
import { InlineEdit } from '../entity-cards/inline-edit'
import {
	$form,
	profileUpdated,
	$isLoading,
	$isBusy,
	$nickMessage,
	$nickStatus,
	nicknameEdited,
	nicknameUpdated,
} from './model'
import { ProfileAvatar } from './profile-avatar'
import { ProfileLanguages, type ProfileLanguagesProps } from './profile-languages'
import { Stack, TS } from '@/ui'

type ProfileHeroProps = {
	headline?: string | null
	availableLanguages: ProfileLanguagesProps['availableLanguages']
}

export function ProfileHero({ headline, availableLanguages }: ProfileHeroProps) {
	const [
		{ name, nickname, location },
		isBusy,
		isLoading,
		nickMessage,
		nickStatus,
		onUpdated,
		onNicknameChange,
		onNicknameUpdated,
	] = useUnit([
		$form,
		$isBusy,
		$isLoading,
		$nickMessage,
		$nickStatus,
		profileUpdated,
		nicknameEdited,
		nicknameUpdated,
	])

	const isNickError = includes(['invalid', 'taken', 'error'], nickStatus)
	return (
		<section className="p-5 md:p-6">
			<Stack gap={8} align="center">
				<ProfileAvatar />
				<Stack gap={2} vertical align="start">
					<Stack gap={2} align="start">
						<InlineEdit
							value={name}
							placeholder="Введите имя"
							loading={isLoading || isBusy}
							variant="h4"
							onSave={(update) => update && onUpdated({ name: update })}
						/>
						<InlineEdit
							notEmpty
							onlyLatin
							minimum={8}
							limit={20}
							value={nickname}
							placeholder="@nickname"
							template="@%s"
							color="dimmed"
							loading={isBusy}
							variant="subtitle"
							error={isNickError ? nickMessage : undefined}
							helper={isNickError ? undefined : nickMessage}
							onChange={(value) => onNicknameChange(value)}
							contentClassName="mt-0.75"
							onSave={(value) => value && onNicknameUpdated(value)}
						/>
					</Stack>
					<TS
						variant="body"
						color="secondary"
						className="w-full text-sm"
						content={headline ?? 'AI Developer'}
					/>
					<Stack gap={2} align="start" className="mt-2">
						<InlineEdit
							value={location}
							placeholder="Укажите локацию"
							contentIcon="map-pin"
							loading={isLoading || isBusy}
							variant="caption"
							onSave={(update) => update && onUpdated({ location: update })}
						/>
						<ProfileLanguages
							availableLanguages={availableLanguages}
							disabled={isBusy}
						/>
					</Stack>
				</Stack>
			</Stack>
		</section>
	)
}
