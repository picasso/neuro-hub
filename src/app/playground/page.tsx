'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useState } from 'react'
import { AlertsDemo } from './demo-alerts'
import { IconsDemo } from './demo-icons'
import { TS } from '@/components/ui'

interface TabPanelProps {
	children?: React.ReactNode
	index: number
	value: number
}

function TabPanel({ children, value, index }: TabPanelProps) {
	return (
		<div role="tabpanel" hidden={value !== index}>
			{value === index && <Box sx={{ py: 3 }}>{children}</Box>}
		</div>
	)
}

export default function PlaygroundPage() {
	const [activeTab, setActiveTab] = useState(2)

	const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
	}

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8 }}>
				<TS variant="h3" gutterBottom>
					Playground
				</TS>
				<TS variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					Эта страница доступна только в режиме разработки для тестирования компонентов и
					решений.
				</TS>

				<Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 6 }}>
					<Tabs value={activeTab} onChange={handleTabChange}>
						<Tab label="Icon" />
						<Tab label="Button" />
						<Tab label="Alerts" />
					</Tabs>
				</Box>

				<TabPanel value={activeTab} index={0}>
					<IconsDemo />
				</TabPanel>

				<TabPanel value={activeTab} index={1}>
					<TS variant="body1" color="text.secondary">
						Button components testing - coming soon
					</TS>
				</TabPanel>

				<TabPanel value={activeTab} index={2}>
					<Stack direction="row" spacing={2}>
						<AlertsDemo />
					</Stack>
				</TabPanel>
			</Box>
		</Container>
	)
}
