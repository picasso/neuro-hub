import { filter } from 'lodash'
import { faqContent } from '@/config'
import { Accordion, PageContainer, TS, type AccordionOption } from '@/ui'

const oddQuestions = filter(faqContent.items, (_, index) => index % 2 === 0)
const evenQuestions = filter(faqContent.items, (_, index) => index % 2 === 1)

export function FaqSection() {
	return (
		<div className="py-16">
			<PageContainer width="desktop">
				<TS variant="h2" gutterBottom className="text-center" content={faqContent.title} />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
					<Accordion collapsible items={oddQuestions as AccordionOption[]} />
					<Accordion collapsible items={evenQuestions as AccordionOption[]} />
				</div>
			</PageContainer>
		</div>
	)
}
