'use client'

import { type ChangeEvent, useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type InputDemoState } from './demo-inputs-settings'
import { text } from './mock'
import { useSettings } from './settings-store'
import { Stack, TextField, TextFieldAuto } from '@/ui'

export function DemoInputs() {
	const settings = useSettings<InputDemoState>()
	const {
		error,
		helperText,
		disabled,
		required,
		startIcon,
		endIcon,
		endIconInline,
		endIconDisabled,
		onEndClick,
		multiline,
		markdown,
		showClear,
		inline,
		enableOnFocus,
	} = settings

	const helperContent = helperText
		? multiline
			? longText
			: 'Мы не передаём почту третьим лицам'
		: undefined

	const [value, setValue] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const resolvedStartIcon = startIcon !== 'none' ? startIcon : undefined
	const resolvedEndIcon = endIcon !== 'none' ? endIcon : undefined

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?TextField` -> `Field` + `Input` : `Textarea` + опциональные иконки через `InputGroup` и `ButtonGroup`"
				separator
			>
				{inline ? (
					<TextFieldAuto
						enableOnFocus={enableOnFocus}
						onlyLatin
						notEmpty
						limit={10}
						value={value}
						onSave={(value) => setValue(String(value ?? ''))}
						helper={
							helperContent
								? { helper: helperContent, md: markdown ? { br: true } : false }
								: undefined
						}
						disabled={disabled}
						required={required}
						showClear={showClear}
						endIconInline={endIconInline}
					/>
				) : (
					<TextField
						multiline={multiline}
						label={multiline ? 'Описание' : 'Email'}
						placeholder={multiline ? text.placeholder.desc : text.placeholder.email}
						error={
							error
								? multiline
									? 'Минимум 50 символов'
									: 'Введите корректный email'
								: undefined
						}
						helper={
							helperContent
								? { helper: helperContent, md: markdown ? { br: true } : false }
								: undefined
						}
						value={value}
						onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
							setValue(e.target.value)
						}
						disabled={disabled}
						required={required}
						startIcon={resolvedStartIcon}
						endIcon={resolvedEndIcon}
						endIconInline={endIconInline}
						endIconDisabled={endIconDisabled}
						onEndClick={onEndClick && resolvedEndIcon ? () => {} : undefined}
						showClear={showClear}
						onClearClick={showClear ? () => setValue('') : undefined}
					/>
				)}
			</DemoSection>

			<DemoSection title="Variants" asBadge="log-in" separator>
				<Stack vertical gap={3} align="stretch">
					<TextField placeholder="Базовый (без label)" />
					<TextField label="Input with label" placeholder="Введите текст" />
					<TextField label="Input with placeholder" placeholder="placeholder текст" />
					<TextField
						label="Input with helper"
						placeholder="Введите текст"
						helper={longText}
					/>
					<TextField
						label="Input with error"
						placeholder="Введите текст"
						defaultValue="неверный ввод"
						error="Это поле обязательно"
					/>
				</Stack>
			</DemoSection>

			<DemoSection title="Icons" asBadge="log-in" separator>
				<Stack vertical gap={3} align="stretch">
					<TextField label="startIcon" placeholder="Поиск..." startIcon="search" />
					<TextField label="endIcon" placeholder="Введите текст" endIcon="x" />
					<TextField
						label="endIcon + onEndClick (password toggle)"
						type={showPassword ? 'text' : 'password'}
						placeholder="Пароль"
						endIcon={showPassword ? 'eye-off' : 'eye'}
						onEndClick={() => setShowPassword((v) => !v)}
					/>
					<TextField
						label="startIcon + endIcon + onEndClick"
						type={showPassword ? 'text' : 'password'}
						placeholder="Пароль"
						startIcon="shield-check"
						endIcon={showPassword ? 'eye-off' : 'eye'}
						onEndClick={() => setShowPassword((v) => !v)}
					/>
				</Stack>
			</DemoSection>

			<DemoSection title="States" asBadge="log-in">
				<Stack vertical gap={3} align="stretch">
					<TextField label="Disabled" placeholder="Недоступно" disabled />
					<TextField label="ReadOnly" defaultValue="Нельзя редактировать" readOnly />
					<TextField label="Required" placeholder="Обязательное поле" required />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

const longText =
	'Это **многострочный текст** или *вспомогательная* `подсказка` для поля ввода и ещё немного текста для проверки длины...'
