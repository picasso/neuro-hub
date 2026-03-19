import type { SVGProps } from 'react'

export function Person({
	accent = '#1dbf73',
	...props
}: SVGProps<SVGSVGElement> & { accent?: string }) {
	return (
		<svg viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
			<path
				d="M28.2462 29.0264V31.3434C28.2462 34.1294 25.9882 36.3874 23.2022 36.3874C20.4162 36.3874 18.1582 34.1294 18.1582 31.3434V29.0264"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M40.3343 42.334V38.957C40.3343 36.538 38.6813 34.433 36.3313 33.859L28.1553 32.292H28.1513C27.7063 34.624 25.6633 36.388 23.2023 36.388C20.7413 36.388 18.7033 34.629 18.2543 32.303H18.2493L10.0773 33.862C7.72531 34.434 6.07031 36.54 6.07031 38.96V42.334"
				fill={accent}
				fillOpacity={0.5}
			/>
			<path
				d="M40.3343 42.334V38.957C40.3343 36.538 38.6813 34.433 36.3313 33.859L28.1553 32.292H28.1513C27.7063 34.624 25.6633 36.388 23.2023 36.388C20.7413 36.388 18.7033 34.629 18.2543 32.303H18.2493L10.0773 33.862C7.72531 34.434 6.07031 36.54 6.07031 38.96V42.334"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M23.001 13H17.6529C16.188 13 15 14.1897 15 15.6567V23.0581C15 24.7116 15.594 26.3097 16.6743 27.5599L18.1986 29.3253C19.1168 30.389 20.4518 31 21.8553 31H24.1447C25.5482 31 26.8832 30.389 27.8014 29.3253L29.3257 27.5599C30.406 26.3097 31 24.7116 31 23.0581V15.6567C31 14.1897 29.812 13 28.3471 13H22.999H23.001Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M31 18H32.1301C32.6544 18 33.0598 18.5039 32.9927 19.0732L32.6254 22.1718C32.5691 22.6459 32.2 23 31.7628 23H31"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M15.2558 18.5645H14.0098C13.4318 18.5645 12.9848 19.0725 13.0588 19.6465L13.4638 22.7705C13.5258 23.2485 13.9328 23.6055 14.4148 23.6055H15.2558"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M15 21L14.5855 16C14.1078 11.8838 17.2082 8.56007 22.1243 8.23857C24.2262 8.10158 26.3159 8 27.9113 8C30.3932 8 31.4164 9.39599 31.8174 10.7929C32.2218 12.2001 31.9396 13.6846 31.1509 14.9715L31.001 18"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeMiterlimit="10"
			/>
			<path
				d="M21.1623 26L21.0117 26.3598C20.879 26.6764 21.8909 26.9569 23.2565 26.9816C23.8403 26.9922 24.4208 27 24.864 27C25.5534 27 25.8376 26.8926 25.949 26.7852C26.0614 26.6769 25.983 26.5627 25.7639 26.4637L25.6386 26.4072"
				stroke="currentColor"
				strokeMiterlimit="10"
				strokeLinecap="round"
			/>
			<path
				d="M24 22.75V22.75C24 22.8881 23.8881 23 23.75 23H23.25C23.1119 23 23 22.8881 23 22.75V22.75V22.3333V22"
				stroke="currentColor"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path d="M20 19V20" stroke="currentColor" strokeLinecap="round" />
			<path d="M26 19V20" stroke="currentColor" strokeLinecap="round" />
		</svg>
	)
}
