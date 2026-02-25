'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState } from 'react'
import { AlertsDemo } from './demo-alerts'
import { IconsDemo } from './demo-icons'
import { PortfolioDemo } from './demo-portfolio'
import { UploaderDemo } from './demo-uploader'
import { TS } from '@/components/ui'

type TabId = 'icon' | 'button' | 'alerts' | 'uploader' | 'portfolio'

interface TabPanelProps {
	children?: React.ReactNode
	tabId: TabId
	value: TabId
}

function TabPanel({ children, value, tabId }: TabPanelProps) {
	return (
		<div role="tabpanel" hidden={value !== tabId}>
			{value === tabId && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	)
}

export default function PlaygroundPage() {
	const [activeTab, setActiveTab] = useState<TabId>('portfolio')

	const handleTabChange = (_event: React.SyntheticEvent, newValue: TabId) => {
		setActiveTab(newValue)
	}

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8 }}>
				<TS variant="h3" gutterBottom>
					Playground
				</TS>
				<TS variant="body" color="secondary" className="mb-8">
					Эта страница доступна только в режиме разработки для тестирования компонентов и
					решений.
				</TS>

				<Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 6 }}>
					<Tabs value={activeTab} onChange={handleTabChange}>
						<Tab value="icon" label="Icon" />
						<Tab value="button" label="Button" />
						<Tab value="alerts" label="Alerts" />
						<Tab value="uploader" label="Uploader" />
						<Tab value="portfolio" label="Portfolio" />
					</Tabs>
				</Box>

				<TabPanel value={activeTab} tabId="icon">
					<IconsDemo />
				</TabPanel>

				<TabPanel value={activeTab} tabId="button">
					<TS variant="body" color="secondary">
						Button components testing - coming soon
					</TS>
				</TabPanel>

				<TabPanel value={activeTab} tabId="alerts">
					<Stack direction="row" spacing={2}>
						<AlertsDemo />
					</Stack>
				</TabPanel>

				<TabPanel value={activeTab} tabId="uploader">
					<UploaderDemo />
				</TabPanel>

				<TabPanel value={activeTab} tabId="portfolio">
					<PortfolioDemo />
				</TabPanel>
			</Box>
		</Container>
	)
}
