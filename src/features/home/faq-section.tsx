'use client'

import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { filter, map } from 'lodash'
import { type ReactNode, useState } from 'react'
import { faqContent } from '@/config'
import { Icon } from '@/ui/icon'
import { TS } from '@/ui/text-styled'

type FaqIconConfig = {
	icon: ReactNode
	color: string
}

const faqIcons: Record<string, FaqIconConfig> = {
	'1': { icon: <Icon name="info" size={24} />, color: '#1e88e5' },
	'2': { icon: <Icon name="percent" size={24} />, color: '#43a047' },
	'3': { icon: <Icon name="payment" size={24} />, color: '#fb8c00' },
	'4': { icon: <Icon name="person-add" size={24} />, color: '#8e24aa' },
	'5': { icon: <Icon name="search" size={24} />, color: '#e53935' },
	'6': { icon: <Icon name="gavel" size={24} />, color: '#6d4c41' },
}

export function FaqSection() {
	const [expanded, setExpanded] = useState<string | false>(false)

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false)
	}

	const oddQuestions = filter(faqContent.items, (_, index) => index % 2 === 0)
	const evenQuestions = filter(faqContent.items, (_, index) => index % 2 === 1)

	return (
		<Box sx={{ py: 8, bgcolor: 'grey.50' }}>
			<Container maxWidth="lg">
				<TS
					variant="h3"
					strong
					className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] mb-12"
					content={faqContent.title}
				/>

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, md: 6 }}>
						{map(oddQuestions, (item) => {
							const iconConfig = faqIcons[item.id]
							return (
								<Accordion
									key={item.id}
									expanded={expanded === item.id}
									onChange={handleChange(item.id)}
									sx={{
										mb: 2,
										borderRadius: 2,
										'&:before': { display: 'none' },
										boxShadow: 'none',
										border: 1,
										borderColor: 'divider',
										'&.Mui-expanded': {
											borderColor: 'primary.main',
											boxShadow: 2,
										},
									}}
								>
									<AccordionSummary
										expandIcon={<Icon name="expand-more" />}
										sx={{
											'& .MuiAccordionSummary-content': {
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
											},
										}}
									>
										<Box
											sx={{
												color: iconConfig.color,
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{iconConfig.icon}
										</Box>
										<TS className="font-semibold" content={item.question} />
									</AccordionSummary>
									<AccordionDetails sx={{ pt: 0, pl: 6 }}>
										<TS color="secondary" content={item.answer} />
									</AccordionDetails>
								</Accordion>
							)
						})}
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						{map(evenQuestions, (item) => {
							const iconConfig = faqIcons[item.id]
							return (
								<Accordion
									key={item.id}
									expanded={expanded === item.id}
									onChange={handleChange(item.id)}
									sx={{
										mb: 2,
										borderRadius: 2,
										'&:before': { display: 'none' },
										boxShadow: 'none',
										border: 1,
										borderColor: 'divider',
										'&.Mui-expanded': {
											borderColor: 'primary.main',
											boxShadow: 2,
										},
									}}
								>
									<AccordionSummary
										expandIcon={<Icon name="expand-more" />}
										sx={{
											'& .MuiAccordionSummary-content': {
												display: 'flex',
												alignItems: 'center',
												gap: 1.5,
											},
										}}
									>
										<Box
											sx={{
												color: iconConfig.color,
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{iconConfig.icon}
										</Box>
										<TS className="font-semibold" content={item.question} />
									</AccordionSummary>
									<AccordionDetails sx={{ pt: 0, pl: 6 }}>
										<TS color="secondary" content={item.answer} />
									</AccordionDetails>
								</Accordion>
							)
						})}
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}
