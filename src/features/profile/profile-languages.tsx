import { useUnit } from 'effector-react'
import { find, map } from 'lodash'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { formatLanguages, getLanguageLabel, langLevelOptions } from './helpers'
import {
	$form,
	$isBusy,
	autosaveRequested,
	languageAdded,
	languageRemoved,
	languageUpdated,
} from './model'
import { type LanguageLevel, type LanguageOption } from './types'
import {
	Alert,
	Button,
	Icon,
	IconButton,
	Popover,
	Select,
	Separator,
	Stack,
	StackSpan,
	TS,
} from '@/ui'
import { cn } from '@/utils'

export type ProfileLanguagesProps = {
	availableLanguages: LanguageOption[]
	disabled?: boolean
}

export function ProfileLanguages({ availableLanguages, disabled }: ProfileLanguagesProps) {
	const [{ languages }, isBusy, onAdd, onRemove, onChange] = useUnit([
		$form,
		$isBusy,
		languageAdded,
		languageRemoved,
		languageUpdated,
	])
	const [open, setOpen] = useState(false)
	const summary = formatLanguages(languages)
	const selectedCodes = useMemo(
		() => new Set(languages.map((language) => language.languageCode).filter(Boolean)),
		[languages],
	)

	const onLangSelect = useCallback(
		(languageCode: string, index: number) => {
			const selected = find(availableLanguages, { code: languageCode })
			if (!selected) return
			onChange({
				index,
				value: {
					languageCode,
					name: selected.name,
					nativeName: selected.nativeName,
				},
			})
		},
		[availableLanguages, onChange],
	)

	const onOpenChange = useCallback((open: boolean) => {
		setOpen(open)
		if (!open) autosaveRequested()
	}, [])

	return (
		<Popover
			open={open}
			onOpenChange={onOpenChange}
			align="start"
			trigger={
				<StackSpan gap={1} className="cursor-pointer hover:bg-accent rounded-md px-1">
					<Icon size="xs" name="languages" />
					<TS
						clean
						variant="caption"
						className={cn('transition-opacity', isBusy && 'opacity-50')}
						content={summary}
					/>
					<Icon size="xs" name="pencil" className="ml-1" />
				</StackSpan>
			}
			footer={
				<Button
					size="xs"
					variant="outline"
					label="Добавить язык"
					leftIcon="message-circle-check"
					disabled={disabled || languages.length >= 32}
					onClick={() => onAdd()}
				/>
			}
		>
			<Stack vertical gap={4} align="stretch">
				<Alert
					severity="info"
					icon="message-circle-check"
					desc="Добавьте языки, которые хотите показывать в шапке публичного профиля."
				/>
				<Stack vertical gap={3} align="stretch">
					{languages.length === 0 ? (
						<TS
							variant="caption"
							color="dimmed"
							content="Пока нет ни одного языка.\nДобавьте первый вариант ниже."
							md={{ json: true }}
							className="text-center"
						/>
					) : null}
					{map(languages, (language, index) => {
						const languageItems = map(availableLanguages, (option) => ({
							value: option.code,
							label: getLanguageLabel(option),
							disabled:
								selectedCodes.has(option.code) &&
								option.code !== language.languageCode,
						}))

						return (
							<Fragment key={language.id}>
								{index > 0 && <Separator />}
								<Stack vertical align="start" className="w-full">
									<Stack className="w-full">
										<Select
											compact
											alignWithTrigger
											disabled={disabled}
											placeholder="Выберите язык"
											value={language.languageCode}
											items={languageItems}
											onValueChange={(code) => onLangSelect(code, index)}
										/>
										<IconButton
											rounded
											variant="ghost"
											icon="trash"
											disabled={disabled}
											onClick={() => onRemove(index)}
										/>
									</Stack>
									<Select
										compact
										alignWithTrigger
										disabled={disabled}
										placeholder="Выберите уровень"
										value={language.langLevel}
										items={langLevelOptions}
										onValueChange={(langLevel: LanguageLevel) =>
											onChange({
												index,
												value: { langLevel },
											})
										}
									/>
								</Stack>
							</Fragment>
						)
					})}
				</Stack>
			</Stack>
		</Popover>
	)
}
