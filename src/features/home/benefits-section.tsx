import { map } from 'lodash'
import { benefitsContent } from '@/config'
import { Card, Icon, PageContainer, Stack, TS, type IconName } from '@/ui'
import { cn } from '@/utils'

type BenefitCardProps = {
	icon: IconName
	title: string
	description: string
	iconColor: 'primary' | 'cta'
}

function BenefitCard({ icon, title, description, iconColor }: BenefitCardProps) {
	return (
		<Card
			title={
				<Stack gap={4}>
					<Stack
						justify="center"
						className={cn(
							'w-14 h-14 shrink-0 rounded-lg',
							iconColor === 'primary' ? 'bg-primary' : 'bg-cta',
						)}
					>
						<Icon name={icon} size={32} color="contrast" />
					</Stack>
					<TS clean variant="h4" content={title} />
				</Stack>
			}
			description={description}
		/>
	)
}

const freelancerIcons: IconName[] = ['users', 'star', 'code', 'badge-check']
const clientIcons: IconName[] = ['shield-check', 'eye', 'thumbs-up', 'search']

export function BenefitsSection() {
	return (
		<div className="py-16 bg-muted/50">
			<PageContainer width="desktop">
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
									iconColor="primary"
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
							className="font-semibold mb-6 text-cta"
							content={benefitsContent.clients.title}
						/>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{map(benefitsContent.clients.items, (item, index) => (
								<BenefitCard
									iconColor="cta"
									key={item.title}
									icon={clientIcons[index]}
									title={item.title}
									description={item.description}
								/>
							))}
						</div>
					</div>
				</div>
			</PageContainer>
		</div>
	)
}
