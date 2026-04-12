import type { SVGProps } from 'react'
export function Apply({
	accent = '#1dbf73',
	...props
}: SVGProps<SVGSVGElement> & { accent?: string }) {
	return (
		<svg viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M46 42.7273C46.55 42.7273 47 42.2307 47 41.6237V4.10354C47 3.49659 46.55 3 46 3H2C1.45 3 1 3.49659 1 4.10354V41.6237C1 42.2307 1.45 42.7273 2 42.7273H46Z"
				fill="white"
				fillOpacity={0.25}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinejoin="round"
			/>
			<path
				d="M4.13623 6.13647H6.22714"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinejoin="round"
			/>
			<path
				d="M7.27295 6.13647H9.36386"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinejoin="round"
			/>
			<path
				d="M10.4092 6.13647H12.5001"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinejoin="round"
			/>
			<path
				d="M5.18164 31.2273H22.9544"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
			<path
				d="M5.18164 34.3635H22.9544"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
			<path
				d="M5.18164 37.5H17.7271"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="square"
				strokeLinejoin="round"
			/>
			<rect
				x="4.13623"
				y="9.27271"
				width="39.7273"
				height="16.7273"
				rx="1"
				fill={accent}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M41.3969 29.9344L29.2273 20.7727V36.3003C29.2352 36.7731 29.5906 36.9361 29.9538 36.5693L33.3575 33.1622L36.6428 39.1613C36.9192 39.6259 37.5668 39.7319 38.0959 39.3895L39.47 38.4929C39.9833 38.1587 40.1887 37.5229 39.9281 37.0502L36.7613 31.3934H40.9073C41.8629 31.369 42.0287 30.3501 41.3969 29.9344Z"
				fill="black"
				fillOpacity={0.5}
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
