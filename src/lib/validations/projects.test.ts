import {
	createApplicationSchema,
	projectAttachmentSchema,
	createProjectSchema,
	fullProjectSchema,
	projectDirectoryQuerySchema,
	updateProjectSchema,
} from './index'

describe('projectDirectoryQuerySchema', () => {
	it('parses defaults and optional filters', () => {
		const result = projectDirectoryQuerySchema.parse({
			q: 'rag assistant',
			budgetMin: '500',
			deadlineBefore: '2030-01-01',
		})

		expect(result.page).toBe(1)
		expect(result.pageSize).toBe(12)
		expect(result.q).toBe('rag assistant')
		expect(result.budgetMin).toBe(500)
		expect(result.deadlineBefore).toBeInstanceOf(Date)
	})
})

describe('createProjectSchema', () => {
	it('accepts a valid project payload', () => {
		const result = createProjectSchema.parse({
			title: 'Build a generative AI support assistant',
			description:
				'Need an experienced freelancer to design and ship a support assistant with retrieval, evaluation and prompt optimization for our internal team.',
			category: 'text_generation',
			experienceLevel: 'senior',
			budgetType: 'fixed',
			budgetMin: 1500,
			budgetMax: 3000,
			deadline: '2030-01-10',
			skillIds: ['550e8400-e29b-41d4-a716-446655440000'],
			attachments: [],
		})

		expect(result.status).toBe('published')
		expect(result.deadline).toBeInstanceOf(Date)
	})

	it('rejects invalid budget range', () => {
		expect(() =>
			createProjectSchema.parse({
				title: 'Build a generative AI support assistant',
				description:
					'Need an experienced freelancer to design and ship a support assistant with retrieval, evaluation and prompt optimization for our internal team.',
				category: 'text_generation',
				experienceLevel: 'senior',
				budgetType: 'fixed',
				budgetMin: 3000,
				budgetMax: 1500,
				deadline: '2030-01-10',
				skillIds: ['550e8400-e29b-41d4-a716-446655440000'],
				attachments: [],
			}),
		).toThrow('Budget max must be greater than or equal to budget min')
	})

	it('rejects unsupported create statuses', () => {
		expect(() =>
			createProjectSchema.parse({
				title: 'Build a generative AI support assistant',
				description:
					'Need an experienced freelancer to design and ship a support assistant with retrieval, evaluation and prompt optimization for our internal team.',
				category: 'text_generation',
				experienceLevel: 'senior',
				budgetType: 'fixed',
				budgetMin: 1500,
				budgetMax: 3000,
				deadline: '2030-01-10',
				status: 'completed',
				skillIds: ['550e8400-e29b-41d4-a716-446655440000'],
				attachments: [],
			}),
		).toThrow()
	})
})

describe('fullProjectSchema', () => {
	it('accepts lifecycle statuses used by updates', () => {
		const result = fullProjectSchema.parse({
			title: 'Build a generative AI support assistant',
			description:
				'Need an experienced freelancer to design and ship a support assistant with retrieval, evaluation and prompt optimization for our internal team.',
			category: 'text_generation',
			experienceLevel: 'senior',
			budgetType: 'fixed',
			budgetMin: 1500,
			budgetMax: 3000,
			deadline: '2020-01-10',
			status: 'in_progress',
			skillIds: ['550e8400-e29b-41d4-a716-446655440000'],
			attachments: [],
		})

		expect(result.status).toBe('in_progress')
		expect(result.deadline).toBeInstanceOf(Date)
	})
})

describe('updateProjectSchema', () => {
	it('accepts lifecycle status changes without create-only restrictions', () => {
		const result = updateProjectSchema.parse({
			status: 'completed',
		})

		expect(result.status).toBe('completed')
	})
})

describe('projectAttachmentSchema', () => {
	it('accepts https attachment urls', () => {
		const result = projectAttachmentSchema.parse({
			filename: 'brief.pdf',
			fileUrl: 'https://example.com/files/brief.pdf',
		})

		expect(result.fileUrl).toBe('https://example.com/files/brief.pdf')
	})

	it('rejects dangerous schemes', () => {
		expect(() =>
			projectAttachmentSchema.parse({
				filename: 'brief.pdf',
				fileUrl: 'javascript:alert(1)',
			}),
		).toThrow('Attachment URL must use https or local development http')
	})
})

describe('createApplicationSchema', () => {
	it('rejects a short cover letter with a Russian message', () => {
		expect(() =>
			createApplicationSchema.parse({
				coverLetter: 'x'.repeat(49),
				proposedPrice: 1200,
			}),
		).toThrow('Сопроводительное письмо должно содержать не менее 50 символов')
	})

	it('rejects a past proposed deadline', () => {
		expect(() =>
			createApplicationSchema.parse({
				coverLetter:
					'У меня есть релевантный опыт в построении RAG-пайплайнов, prompt engineering и интеграции ассистентов в существующие продуктовые процессы.',
				proposedPrice: 1200,
				proposedDeadline: '2020-01-01',
			}),
		).toThrow('Предлагаемый срок должен быть в будущем')
	})
})
