import { API } from './api'
import { Apply } from './apply'
import { LinkedIn } from './linkedin'
import { Missing } from './missing'
import { Missing2 } from './missing2'
import { Person } from './person'
import { Spinner } from './spinner'
import { Telegram } from './telegram'
import { XTwitter } from './x-twitter'

export const customIcons = {
	spinner: Spinner,
	linkedIn: LinkedIn,
	telegram: Telegram,
	xTwitter: XTwitter,
	missing: Missing,
	missingMore: Missing2,
	nobody: Person,
	api: API,
	apply: Apply,
}
