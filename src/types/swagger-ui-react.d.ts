declare module 'swagger-ui-react' {
	import type { FC } from 'react'

	interface SwaggerUIProps {
		url?: string
		spec?: object
		[key: string]: unknown
	}

	const SwaggerUI: FC<SwaggerUIProps>
	export default SwaggerUI
}

declare module 'swagger-ui-react/swagger-ui.css' {
	const content: { [className: string]: string }
	export default content
}
