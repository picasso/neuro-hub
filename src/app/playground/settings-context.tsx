'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

type WriterContextValue = {
	register: (node: ReactNode) => void
	clear: () => void
}

const WriterContext = createContext<WriterContextValue | null>(null)
const ReaderContext = createContext<ReactNode | null>(null)

export function PlaygroundSettingsProvider({ children }: { children: ReactNode }) {
	const [node, setNode] = useState<ReactNode | null>(null)

	const writer = useMemo<WriterContextValue>(
		() => ({ register: setNode, clear: () => setNode(null) }),
		[],
	)

	return (
		<WriterContext.Provider value={writer}>
			<ReaderContext.Provider value={node}>{children}</ReaderContext.Provider>
		</WriterContext.Provider>
	)
}

export function useRegisterSettings(settingsNode: ReactNode) {
	const ctx = useContext(WriterContext)
	if (!ctx) {
		throw new Error('`!useRegisterSettings` must be used within `PlaygroundSettingsProvider`')
	}
	useEffect(() => {
		ctx.register(settingsNode)
		return () => ctx.clear()
	})
}

export function SettingsSlot() {
	return useContext(ReaderContext)
}
