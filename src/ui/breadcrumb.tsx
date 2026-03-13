import { isArray, map } from 'lodash'
import { Fragment, type ComponentProps } from 'react'
import { Link } from './link'
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	Breadcrumb as ShadcnBreadcrumb,
} from './shadcn/breadcrumb'

type ShadcnBreadcrumbProps = ComponentProps<typeof ShadcnBreadcrumb>

export type BreadcrumbProps = ShadcnBreadcrumbProps & {
	path?: Array<string | [string, string]>
	lastAlwaysPage?: boolean
}

export function Breadcrumb({ path, children, lastAlwaysPage = true, ...props }: BreadcrumbProps) {
	if (children)
		return (
			<ShadcnBreadcrumb {...props}>
				<BreadcrumbList>{children}</BreadcrumbList>
			</ShadcnBreadcrumb>
		)
	return (
		<ShadcnBreadcrumb {...props}>
			<BreadcrumbList>
				{map(path, (item, index) => {
					const isLast = index === (path?.length ?? 0) - 1
					return (
						<Fragment key={index}>
							<BreadcrumbItem>
								{isArray(item) ? (
									<BreadcrumbLink asChild>
										{isLast && lastAlwaysPage ? (
											<BreadcrumbPage>{item[0]}</BreadcrumbPage>
										) : (
											<Link href={item[1]} className="text-sm text-dimmed">
												{item[0]}
											</Link>
										)}
									</BreadcrumbLink>
								) : (
									<BreadcrumbPage className={!isLast ? 'text-dimmed' : undefined}>
										{item}
									</BreadcrumbPage>
								)}
							</BreadcrumbItem>
							{index < (path?.length ?? 0) - 1 && <BreadcrumbSeparator />}
						</Fragment>
					)
				})}
			</BreadcrumbList>
		</ShadcnBreadcrumb>
	)
}
