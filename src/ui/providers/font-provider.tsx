'use client'

import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import * as React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { fontLabels, type FontId } from '@/app/fonts'

const FONT_STORAGE_KEY = 'font-preference'
const FONT_IDS: FontId[] = ['manrope', 'inter', 'open-sans']

function getStoredFont(): FontId {
	if (typeof window === 'undefined') return 'manrope'
	const stored = window.localStorage.getItem(FONT_STORAGE_KEY)
	return stored && FONT_IDS.includes(stored as FontId) ? (stored as FontId) : 'manrope'
}

function applyFont(id: FontId) {
	document.body.dataset.font = id
}

const FontContext = React.createContext<
	{ font: FontId; setFont: (id: FontId) => void; mounted: boolean } | undefined
>(undefined)

export function FontProvider({ children }: { children: React.ReactNode }) {
	const [font, setFontState] = useState<FontId>('manrope')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		const stored = getStoredFont()
		applyFont(stored)
		setFontState(stored)
		setMounted(true)
	}, [])

	const setFont = useCallback((id: FontId) => {
		applyFont(id)
		window.localStorage.setItem(FONT_STORAGE_KEY, id)
		setFontState(id)
	}, [])

	return (
		<FontContext.Provider value={{ font, setFont, mounted }}>{children}</FontContext.Provider>
	)
}

export function useFont() {
	const ctx = React.useContext(FontContext)
	if (!ctx) throw new Error('useFont must be used within FontProvider')
	return ctx
}

export function FontSwitcher() {
	const { font, setFont, mounted } = useFont()

	if (!mounted) return null

	return (
		<ToggleButtonGroup
			value={font}
			exclusive
			onChange={(_, value) => value && setFont(value)}
			size="small"
			sx={{ ml: 1 }}
		>
			{FONT_IDS.map((id) => (
				<ToggleButton key={id} value={id} aria-label={fontLabels[id]}>
					{fontLabels[id]}
				</ToggleButton>
			))}
		</ToggleButtonGroup>
	)
}
