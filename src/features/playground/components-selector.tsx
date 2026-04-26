import { useState } from 'react'
import { type ComponentDemo, componentDemos, groupLabels } from './components'
import {
	CommandRoot,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Icon,
	Popover,
} from '@/ui'
import { cn } from '@/utils'

type ComponentSelectorProps = {
	selected: ComponentDemo | null
	onSelect: (component: ComponentDemo) => void
}

const groups = Object.groupBy(componentDemos, (c) => c.group)

export function ComponentSelector({ selected, onSelect }: ComponentSelectorProps) {
	const [open, setOpen] = useState(false)

	return (
		<Popover
			flush
			align="end"
			open={open}
			onOpenChange={setOpen}
			button={selected ? selected.name : 'Выбрать компонент...'}
			buttonChevron
			buttonProps={{
				variant: 'outline',
				role: 'combobox',
				'aria-expanded': open,
				className: 'w-65 justify-between',
			}}
		>
			<CommandRoot>
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
			</CommandRoot>
		</Popover>
	)
}
