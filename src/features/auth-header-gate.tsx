'use client'

import { useGate } from 'effector-react'
import type { AuthHeaderState } from '@/lib/account'
import type { PropsWithChildren } from 'react'
import { AuthHeaderGate } from '@/stores'

type AuthHeaderGateProps = PropsWithChildren<{
	state: AuthHeaderState
}>

export function AuthHeaderGateProvider({ state, children }: AuthHeaderGateProps) {
	useGate(AuthHeaderGate, state)

	return children
}
