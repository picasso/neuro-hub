import { LoginModal } from './login-modal'
import { createModal, registerModal } from '@/modals'

const loginModalId = 'login-modal'
let isLoginModalRegistered = false

function ensureLoginModalRegistered() {
	if (isLoginModalRegistered) return
	registerModal(loginModalId, null, LoginModal)
	isLoginModalRegistered = true
}

const openRegisteredLoginModal = createModal(loginModalId, null, true)

export const openLoginModal: typeof openRegisteredLoginModal = (override) => {
	ensureLoginModalRegistered()
	return openRegisteredLoginModal(override)
}
