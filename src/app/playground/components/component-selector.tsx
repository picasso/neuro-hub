'use client'

import { Check, ChevronsUpDown, Circle, CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { type ComponentDemo, componentDemos, groupLabels } from '../data/components'
import { Button } from '@/components/shadcn/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/shadcn/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover'
import { cn } from '@/lib/utils'

type ComponentSelectorProps = {
	selected: ComponentDemo | null
	onSelect: (component: ComponentDemo) => void
}

const groups = Object.groupBy(componentDemos, (c) => c.group)

export function ComponentSelector({ selected, onSelect }: ComponentSelectorProps) {
	const [open, setOpen] = useState(false)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[260px] justify-between"
				>
					{selected ? selected.name : 'Выбрать компонент...'}
					<ChevronsUpDown className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[260px] p-0" align="start">
				<Command>
					<CommandInput placeholder="Поиск..." />
					<CommandList>
						<CommandEmpty>Ничего не найдено.</CommandEmpty>
						{(Object.keys(groups) as ComponentDemo['group'][]).map((group) => (
							<CommandGroup key={group} heading={groupLabels[group]}>
								{groups[group]?.map((component) => (
									<CommandItem
										key={component.id}
										value={component.name}
										onSelect={() => {
											onSelect(component)
											setOpen(false)
										}}
									>
										{component.ready ? (
											<CircleCheck className="text-primary" />
										) : (
											<Circle className="text-dimmed" />
										)}
										{component.name}
										<Check
											className={cn(
												'ml-auto',
												selected?.id === component.id
													? 'opacity-100'
													: 'opacity-0',
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
