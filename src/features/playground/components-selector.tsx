import { useState } from 'react'
import { type ComponentDemo, componentDemos, groupLabels } from './components'
import { cn } from '@/lib/utils'
import {
	Button,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/ui'

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
					className="w-65 justify-between"
				>
					{selected ? selected.name : 'Выбрать компонент...'}
					<Icon name="chevrons-up-down" size="sm" className="opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-65 p-0" align="start">
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
										<Icon
											name={component.ready ? 'circle-check' : 'circle'}
											size="sm"
											color={component.ready ? 'primary' : 'dimmed'}
										/>
										{component.name}
										<Icon
											name="check"
											size="sm"
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
