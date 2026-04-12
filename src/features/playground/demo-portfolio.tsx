'use client'

import { useMemo } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { mediaActionOptions, type PortfolioDemoState } from './demo-portfolio-settings'
import { createPortfolioItems } from './mock-generators'
import { useSettings } from './settings-store'
import { Portfolio } from '@/ui'

export function PortfolioDemo() {
	const settings = useSettings<PortfolioDemoState>()
	const {
		allowSelection,
		selectedActions,
		disabled,
		onlyImages,
		refreshKey,
		linkActionPreview,
		fade,
		fadeFn,
		slow,
		random,
		delay,
	} = settings

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const items = useMemo(() => createPortfolioItems({ onlyImages }), [onlyImages, refreshKey])

	return (
		<DemoRoot>
			<DemoSection
				title="Portfolio"
				desc="Media `?Portfolio` —> **React Photo Album** and `Dialog` viewer"
				className="pt-6"
			>
				<Portfolio
					allowSelection={allowSelection}
					selectedActions={mediaActionOptions[selectedActions]}
					linkActionPreview={linkActionPreview}
					disabled={disabled}
					items={items}
					fade={fade}
					fadeFn={fadeFn}
					debug={{ slow, random, delay }}
				/>
			</DemoSection>
		</DemoRoot>
	)
}
