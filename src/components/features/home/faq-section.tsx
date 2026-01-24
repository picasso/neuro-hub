'use client'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GavelIcon from '@mui/icons-material/Gavel'
import InfoIcon from '@mui/icons-material/Info'
import PaymentIcon from '@mui/icons-material/Payment'
import PercentIcon from '@mui/icons-material/Percent'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import SearchIcon from '@mui/icons-material/Search'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { type ReactNode, useState } from 'react'
import { faqContent } from '@/config/mocks'

type FaqIconConfig = {
	icon: ReactNode
	color: string
}

const faqIcons: Record<string, FaqIconConfig> = {
	'1': { icon: <InfoIcon sx={{ fontSize: 24 }} />, color: '#1e88e5' },
	'2': { icon: <PercentIcon sx={{ fontSize: 24 }} />, color: '#43a047' },
	'3': { icon: <PaymentIcon sx={{ fontSize: 24 }} />, color: '#fb8c00' },
	'4': { icon: <PersonAddIcon sx={{ fontSize: 24 }} />, color: '#8e24aa' },
	'5': { icon: <SearchIcon sx={{ fontSize: 24 }} />, color: '#e53935' },
	'6': { icon: <GavelIcon sx={{ fontSize: 24 }} />, color: '#6d4c41' },
}

export function FaqSection() {
	const [expanded, setExpanded] = useState<string | false>(false)

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : false)
	}

	const oddQuestions = faqContent.items.filter((_, index) => index % 2 === 0)
	const evenQuestions = faqContent.items.filter((_, index) => index % 2 === 1)

	return (
		<Box sx={{ py: 8, bgcolor: 'grey.50' }}>
			<Container maxWidth="lg">
				<Typography
					variant="h3"
					component="h2"
					align="center"
					gutterBottom
					fontWeight={700}
					sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, mb: 6 }}
				>
					{faqContent.title}
				</Typography>

				<Grid container spacing={3}>
					<Grid size={{ xs: 12, md: 6 }}>
						{oddQuestions.map((item) => {
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
										expandIcon={<ExpandMoreIcon />}
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
										<Typography fontWeight={600}>{item.question}</Typography>
									</AccordionSummary>
									<AccordionDetails sx={{ pt: 0, pl: 6 }}>
										<Typography color="text.secondary">
											{item.answer}
										</Typography>
									</AccordionDetails>
								</Accordion>
							)
						})}
					</Grid>

					<Grid size={{ xs: 12, md: 6 }}>
						{evenQuestions.map((item) => {
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
										expandIcon={<ExpandMoreIcon />}
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
										<Typography fontWeight={600}>{item.question}</Typography>
									</AccordionSummary>
									<AccordionDetails sx={{ pt: 0, pl: 6 }}>
										<Typography color="text.secondary">
											{item.answer}
										</Typography>
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
