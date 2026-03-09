'use client'

import { map } from 'lodash'
import { benefitsContent } from '@/config'
import { Icon, Stack, TS, type IconName } from '@/ui'

type BenefitCardProps = {
	icon: IconName
	title: string
	description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
	return (
		<Stack
			gap={4}
			className="p-6 h-full w-full border border-border rounded-lg transition-all duration-300 hover:shadow-lg hover:border-primary"
		>
			<div className="flex items-center justify-center w-14 h-14 shrink-0 bg-primary/10 rounded-lg">
				<Icon name={icon} size={32} color="contrast" />
			</div>
			<TS variant="h5" gutterBottom className="font-semibold" content={title} />
			<TS variant="body" color="secondary" className="text-sm" content={description} />
		</Stack>
	)
}

const freelancerIcons: IconName[] = ['groups', 'star', 'code', 'verified']
const clientIcons: IconName[] = ['verified-user', 'visibility', 'thumb-up', 'search']

export function BenefitsSection() {
	return (
		<div className="py-16 bg-muted/50">
			<div className="container max-w-5xl mx-auto px-4">
				<TS
					variant="h3"
					strong
					className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] mb-12"
					content="Почему выбирают NeuroGig"
				/>

				<div className="grid grid-cols-1 gap-12">
					<div>
						<TS
							variant="h5"
							gutterBottom
							className="font-semibold mb-6 text-primary"
							content={benefitsContent.freelancers.title}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{map(benefitsContent.freelancers.items, (item, index) => (
								<BenefitCard
									key={item.title}
									icon={freelancerIcons[index]}
									title={item.title}
									description={item.description}
								/>
							))}
						</div>
					</div>

					<div>
						<TS
							variant="h5"
							gutterBottom
							className="font-semibold mb-6 text-secondary-foreground"
							content={benefitsContent.clients.title}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{map(benefitsContent.clients.items, (item, index) => (
								<BenefitCard
									key={item.title}
									icon={clientIcons[index]}
									title={item.title}
									description={item.description}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
