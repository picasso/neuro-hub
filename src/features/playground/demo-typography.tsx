'use client'

import { DemoRoot, DemoSection } from './components-utils'
import { DemoTypographyOptions } from './demo-typography-options'
import { type TabItem, Tabs, TS } from '@/ui'

// main demo --------------------------------------------------------------------------------------]

export function DemoTypography() {
	return (
		<DemoRoot>
			<Tabs items={tabs} defaultValue="text" variant="default" contentClassName="pt-6" />
		</DemoRoot>
	)
}

export function DemoTypographyText() {
	return (
		<DemoRoot>
			<DemoSection
				title="Typography"
				desc="Использование `?Typography` для текста - headings, quotes, paragraphs, lists...etc"
				className="max-w-3xl relative mt-4 mb-12 p-10 overflow-hidden rounded-xl border"
			>
				<TS variant="h1" content="Taxing Laughter: The Joke Tax Chronicles" />
				<TS variant="lead">
					Once upon a time, in a far-off land, there was a very lazy king who spent all
					day lounging on his throne. One day, his advisors came to him with a problem:
					the kingdom was running out of money.
				</TS>
				<TS variant="h2" content="The King's Plan" />
				<TS variant="body">
					The king thought long and hard, and finally came up with a brilliant plan: he
					would tax the jokes in the kingdom.
				</TS>
				<TS variant="quote">
					"After all," he said, "everyone enjoys a good joke, so it's only fair that they
					should pay for the privilege."
				</TS>
				<TS variant="h3" content="The Joke Tax" />
				<TS variant="body">
					The king's subjects were not amused. They grumbled and complained, but the king
					was firm:
				</TS>
				<TS
					variant="list"
					content="1st level of puns: **5 gold coins**\n2nd level of jokes: **10 gold coins**\n3rd level of one-liners : **20 gold coins**"
				/>
				<TS variant="subtitle">
					As a result, people stopped telling jokes, and the kingdom fell into a gloom.
					But there was one person who refused to let the king's foolishness get him down:
					a court `jester` named **Jokester**.
				</TS>
				<TS variant="h4" content="Jokester's Revolt" />
				<TS variant="body">
					Jokester began sneaking into the castle in the middle of the night and leaving
					jokes all over the place: under the king's pillow, in his soup, even in the
					royal toilet. The king was furious, but he couldn't seem to stop Jokester.
				</TS>
				<TS variant="body">
					And then, one day, the people of the kingdom discovered that the jokes left by
					Jokester were so funny that they couldn't help but laugh. And once they started
					laughing, they couldn't stop.
				</TS>
				<TS variant="h4" content="The People's Rebellion" />
				<TS variant="body" color="destructive">
					The people of the kingdom, feeling uplifted by the laughter, started to tell
					jokes and puns again, and soon the entire kingdom was in on the joke.
				</TS>
				<TS variant="body" gutterBottom color="secondary">
					The king, seeing how much happier his subjects were, realized the error of his
					ways and repealed the joke tax. Jokester was declared a hero, and the kingdom
					lived happily ever after.
				</TS>
				<TS variant="caption" color="dimmed">
					The moral of the story is: never underestimate the power of a good laugh and
					always be careful of bad ideas.
				</TS>
			</DemoSection>
		</DemoRoot>
	)
}

const tabs: TabItem[] = [
	{
		value: 'text',
		title: 'Text',
		icon: 'file-text',
		content: <DemoTypographyText />,
	},
	{
		value: 'options',
		title: 'Options',
		icon: 'sliders-horizontal',
		content: <DemoTypographyOptions />,
	},
]
