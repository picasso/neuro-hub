import { kysely } from '@/lib/db'
import {
	type ApplicationsQueryInput,
	type CreateApplicationInput,
	type CreateProjectInput,
	fullProjectSchema,
	type ProjectAttachmentInput,
	type ProjectDirectoryQueryInput,
	type ProjectStatus,
	type UpdateProjectInput,
} from '@/lib/validations'
import { ConflictError, NotFoundError, ValidationError } from '@/utils/errors'

export type ProjectClientSummary = {
	userId: string
	name: string | null
	companyName: string | null
	companyRole: string | null
	avatarUrl: string | null
}

export type ProjectSkillSummary = {
	id: string
	name: string
	category: string | null
}

export type ProjectAttachmentSummary = {
	id: string
	filename: string
	fileUrl: string
	mimeType: string | null
	fileSizeBytes: number | null
	createdAt: Date | null
}

export type PublicProjectListItem = {
	id: string
	href: string
	title: string
	descriptionSnippet: string
	category: string
	experienceLevel: string
	budgetType: string
	budgetMin: number
	budgetMax: number
	deadline: Date
	status: string
	createdAt: Date | null
	client: ProjectClientSummary
	skills: ProjectSkillSummary[]
}

export type ClientProjectListItem = PublicProjectListItem

export type PublicProjectDetail = {
	id: string
	title: string
	description: string
	category: string
	experienceLevel: string
	budgetType: string
	budgetMin: number
	budgetMax: number
	deadline: Date
	status: string
	createdAt: Date | null
	updatedAt: Date | null
	client: ProjectClientSummary
	skills: ProjectSkillSummary[]
	attachments: ProjectAttachmentSummary[]
	viewerApplication: {
		id: string
		status: string
		createdAt: Date | null
	} | null
}

export type CreateProjectResult = {
	id: string
	title: string
	status: string
}

export type FreelancerApplicationListItem = {
	id: string
	status: string
	coverLetter: string
	proposedPrice: number
	proposedDeadline: Date | null
	createdAt: Date | null
	updatedAt: Date | null
	project: {
		id: string
		href: string
		title: string
		category: string
		experienceLevel: string
		budgetType: string
		budgetMin: number
		budgetMax: number
		deadline: Date
		status: string
		client: ProjectClientSummary
		skills: ProjectSkillSummary[]
	}
}

export type ListPublicProjectsResult = {
	items: PublicProjectListItem[]
	page: number
	pageSize: number
	total: number
	hasMore: boolean
}

export type ListFreelancerApplicationsResult = {
	items: FreelancerApplicationListItem[]
	page: number
	pageSize: number
	total: number
	hasMore: boolean
}

export type ClientProjectApplicationListItem = {
	id: string
	status: string
	coverLetter: string
	proposedPrice: number
	proposedDeadline: Date | null
	createdAt: Date | null
	updatedAt: Date | null
	freelancer: {
		userId: string
		name: string | null
		avatarUrl: string | null
	}
}

export type ClientProjectApplicationsGroup = {
	project: {
		id: string
		href: string
		title: string
		category: string
		experienceLevel: string
		budgetType: string
		budgetMin: number
		budgetMax: number
		deadline: Date
		status: string
		skills: ProjectSkillSummary[]
	}
	applications: ClientProjectApplicationListItem[]
}

export type ListClientProjectApplicationsResult = {
	items: ClientProjectApplicationsGroup[]
}

export async function listPublicProjects(
	input: ProjectDirectoryQueryInput,
): Promise<ListPublicProjectsResult> {
	const { page, pageSize, q, category, experienceLevel, budgetType, budgetMin, budgetMax } = input
	const offset = (page - 1) * pageSize
	const search = q ? `%${q}%` : undefined
	const now = new Date()

	let countQuery = kysely
		.selectFrom('projects as project')
		.leftJoin('user_profiles as profile', 'profile.user_id', 'project.client_id')
		.select((eb) => eb.fn.countAll().as('count'))
		.where('project.status', '=', 'published')
		.where('project.deadline', '>', now)

	let rowsQuery = kysely
		.selectFrom('projects as project')
		.leftJoin('user_profiles as profile', 'profile.user_id', 'project.client_id')
		.select([
			'project.id as id',
			'project.title as title',
			'project.description as description',
			'project.category as category',
			'project.experience_level as experienceLevel',
			'project.budget_type as budgetType',
			'project.budget_min as budgetMin',
			'project.budget_max as budgetMax',
			'project.deadline as deadline',
			'project.status as status',
			'project.created_at as createdAt',
			'project.client_id as clientId',
			'profile.name as name',
			'profile.company_name as companyName',
			'profile.company_role as companyRole',
			'profile.avatar_url as avatarUrl',
		])
		.where('project.status', '=', 'published')
		.where('project.deadline', '>', now)

	if (category) {
		countQuery = countQuery.where('project.category', '=', category)
		rowsQuery = rowsQuery.where('project.category', '=', category)
	}

	if (experienceLevel) {
		countQuery = countQuery.where('project.experience_level', '=', experienceLevel)
		rowsQuery = rowsQuery.where('project.experience_level', '=', experienceLevel)
	}

	if (budgetType) {
		countQuery = countQuery.where('project.budget_type', '=', budgetType)
		rowsQuery = rowsQuery.where('project.budget_type', '=', budgetType)
	}

	if (budgetMin !== undefined) {
		countQuery = countQuery.where('project.budget_max', '>=', budgetMin)
		rowsQuery = rowsQuery.where('project.budget_max', '>=', budgetMin)
	}

	if (budgetMax !== undefined) {
		countQuery = countQuery.where('project.budget_min', '<=', budgetMax)
		rowsQuery = rowsQuery.where('project.budget_min', '<=', budgetMax)
	}

	if (input.deadlineBefore) {
		countQuery = countQuery.where('project.deadline', '<=', input.deadlineBefore)
		rowsQuery = rowsQuery.where('project.deadline', '<=', input.deadlineBefore)
	}

	if (search) {
		countQuery = countQuery.where((eb) =>
			eb.or([
				eb('project.title', 'ilike', search),
				eb('project.description', 'ilike', search),
				eb('profile.name', 'ilike', search),
				eb('profile.company_name', 'ilike', search),
				eb.exists(
					eb
						.selectFrom('project_skills as project_skill')
						.innerJoin('skills as skill', 'skill.id', 'project_skill.skill_id')
						.select('project_skill.project_id')
						.whereRef('project_skill.project_id', '=', 'project.id')
						.where('skill.name', 'ilike', search),
				),
			]),
		)
		rowsQuery = rowsQuery.where((eb) =>
			eb.or([
				eb('project.title', 'ilike', search),
				eb('project.description', 'ilike', search),
				eb('profile.name', 'ilike', search),
				eb('profile.company_name', 'ilike', search),
				eb.exists(
					eb
						.selectFrom('project_skills as project_skill')
						.innerJoin('skills as skill', 'skill.id', 'project_skill.skill_id')
						.select('project_skill.project_id')
						.whereRef('project_skill.project_id', '=', 'project.id')
						.where('skill.name', 'ilike', search),
				),
			]),
		)
	}

	switch (input.sort) {
		case 'budget_asc':
			rowsQuery = rowsQuery.orderBy('project.budget_min', 'asc')
			break
		case 'budget_desc':
			rowsQuery = rowsQuery.orderBy('project.budget_max', 'desc')
			break
		case 'deadline_asc':
			rowsQuery = rowsQuery.orderBy('project.deadline', 'asc')
			break
		default:
			rowsQuery = rowsQuery.orderBy('project.created_at', 'desc')
			break
	}

	const countResult = await countQuery.executeTakeFirstOrThrow()
	const total = Number(countResult.count)
	const rows = await rowsQuery.limit(pageSize).offset(offset).execute()

	if (rows.length === 0) {
		return {
			items: [],
			page,
			pageSize,
			total,
			hasMore: false,
		}
	}

	const skillsByProjectId = await getSkillsByProjectIds(rows.map((row) => row.id))

	return {
		items: rows.map((row) => ({
			id: row.id,
			href: `/projects/${row.id}`,
			title: row.title,
			descriptionSnippet: toSnippet(row.description),
			category: row.category,
			experienceLevel: row.experienceLevel,
			budgetType: row.budgetType,
			budgetMin: row.budgetMin,
			budgetMax: row.budgetMax,
			deadline: row.deadline,
			status: row.status,
			createdAt: row.createdAt,
			client: {
				userId: row.clientId,
				name: row.name,
				companyName: row.companyName,
				companyRole: row.companyRole,
				avatarUrl: row.avatarUrl,
			},
			skills: skillsByProjectId.get(row.id) ?? [],
		})),
		page,
		pageSize,
		total,
		hasMore: offset + rows.length < total,
	}
}

export async function getPublicProjectById(
	projectId: string,
	viewerUserId?: string,
): Promise<PublicProjectDetail | null> {
	const project = await kysely
		.selectFrom('projects as project')
		.leftJoin('user_profiles as profile', 'profile.user_id', 'project.client_id')
		.select([
			'project.id as id',
			'project.title as title',
			'project.description as description',
			'project.category as category',
			'project.experience_level as experienceLevel',
			'project.budget_type as budgetType',
			'project.budget_min as budgetMin',
			'project.budget_max as budgetMax',
			'project.deadline as deadline',
			'project.status as status',
			'project.created_at as createdAt',
			'project.updated_at as updatedAt',
			'project.client_id as clientId',
			'profile.name as name',
			'profile.company_name as companyName',
			'profile.company_role as companyRole',
			'profile.avatar_url as avatarUrl',
		])
		.where('project.id', '=', projectId)
		.where('project.status', '=', 'published')
		.executeTakeFirst()

	if (!project) return null

	const [skillsByProjectId, attachmentsByProjectId] = await Promise.all([
		getSkillsByProjectIds([projectId]),
		getAttachmentsByProjectIds([projectId]),
	])

	const viewerApplication = viewerUserId
		? await kysely
				.selectFrom('applications')
				.select(['id', 'status', 'created_at as createdAt'])
				.where('project_id', '=', projectId)
				.where('freelancer_id', '=', viewerUserId)
				.executeTakeFirst()
		: null

	return {
		id: project.id,
		title: project.title,
		description: project.description,
		category: project.category,
		experienceLevel: project.experienceLevel,
		budgetType: project.budgetType,
		budgetMin: project.budgetMin,
		budgetMax: project.budgetMax,
		deadline: project.deadline,
		status: project.status,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt,
		client: {
			userId: project.clientId,
			name: project.name,
			companyName: project.companyName,
			companyRole: project.companyRole,
			avatarUrl: project.avatarUrl,
		},
		skills: skillsByProjectId.get(projectId) ?? [],
		attachments: attachmentsByProjectId.get(projectId) ?? [],
		viewerApplication: viewerApplication
			? {
					id: viewerApplication.id,
					status: viewerApplication.status,
					createdAt: viewerApplication.createdAt,
				}
			: null,
	}
}

export async function listClientProjects({
	clientId,
}: {
	clientId: string
}): Promise<ClientProjectListItem[]> {
	const rows = await kysely
		.selectFrom('projects as project')
		.leftJoin('user_profiles as profile', 'profile.user_id', 'project.client_id')
		.select([
			'project.id as id',
			'project.title as title',
			'project.description as description',
			'project.category as category',
			'project.experience_level as experienceLevel',
			'project.budget_type as budgetType',
			'project.budget_min as budgetMin',
			'project.budget_max as budgetMax',
			'project.deadline as deadline',
			'project.status as status',
			'project.created_at as createdAt',
			'project.client_id as clientId',
			'profile.name as name',
			'profile.company_name as companyName',
			'profile.company_role as companyRole',
			'profile.avatar_url as avatarUrl',
		])
		.where('project.client_id', '=', clientId)
		.orderBy('project.created_at', 'desc')
		.execute()

	if (rows.length === 0) {
		return []
	}

	const skillsByProjectId = await getSkillsByProjectIds(rows.map((row) => row.id))

	return rows.map((row) => ({
		id: row.id,
		href: `/projects/${row.id}`,
		title: row.title,
		descriptionSnippet: toSnippet(row.description),
		category: row.category,
		experienceLevel: row.experienceLevel,
		budgetType: row.budgetType,
		budgetMin: row.budgetMin,
		budgetMax: row.budgetMax,
		deadline: row.deadline,
		status: row.status,
		createdAt: row.createdAt,
		client: {
			userId: row.clientId,
			name: row.name,
			companyName: row.companyName,
			companyRole: row.companyRole,
			avatarUrl: row.avatarUrl,
		},
		skills: skillsByProjectId.get(row.id) ?? [],
	}))
}

export async function createProjectForClient({
	clientId,
	input,
}: {
	clientId: string
	input: CreateProjectInput
}): Promise<CreateProjectResult> {
	assertAllowedProjectCreateStatus(input.status)

	return kysely.transaction().execute(async (trx) => {
		const inserted = await trx
			.insertInto('projects')
			.values({
				client_id: clientId,
				title: input.title,
				description: input.description,
				category: input.category,
				experience_level: input.experienceLevel,
				budget_type: input.budgetType,
				budget_min: input.budgetMin,
				budget_max: input.budgetMax,
				deadline: input.deadline,
				status: input.status,
				updated_at: new Date(),
			})
			.returning(['id', 'title', 'status'])
			.executeTakeFirstOrThrow()

		await replaceProjectSkills(trx, inserted.id, input.skillIds)
		await replaceProjectAttachments(trx, inserted.id, input.attachments)

		return inserted
	})
}

export async function updateProjectForClient({
	projectId,
	clientId,
	input,
}: {
	projectId: string
	clientId: string
	input: UpdateProjectInput
}): Promise<CreateProjectResult> {
	return kysely.transaction().execute(async (trx) => {
		const existing = await trx
			.selectFrom('projects')
			.selectAll()
			.where('id', '=', projectId)
			.executeTakeFirst()

		if (!existing || existing.client_id !== clientId) {
			throw new NotFoundError('Project not found')
		}

		if (input.status !== undefined) {
			assertAllowedProjectStatusTransition(existing.status as ProjectStatus, input.status)
		}

		const [skillsByProjectId, attachmentsByProjectId] = await Promise.all([
			getSkillsByProjectIds([projectId]),
			getAttachmentsByProjectIds([projectId]),
		])

		fullProjectSchema.parse({
			title: input.title ?? existing.title,
			description: input.description ?? existing.description,
			category: input.category ?? existing.category,
			experienceLevel: input.experienceLevel ?? existing.experience_level,
			budgetType: input.budgetType ?? existing.budget_type,
			budgetMin: input.budgetMin ?? existing.budget_min,
			budgetMax: input.budgetMax ?? existing.budget_max,
			deadline: input.deadline ?? existing.deadline,
			status: input.status ?? existing.status,
			skillIds:
				input.skillIds ?? (skillsByProjectId.get(projectId) ?? []).map((item) => item.id),
			attachments:
				input.attachments ??
				(attachmentsByProjectId.get(projectId) ?? []).map((item) => ({
					filename: item.filename,
					fileUrl: item.fileUrl,
					mimeType: item.mimeType ?? undefined,
					fileSizeBytes: item.fileSizeBytes ?? undefined,
				})),
		})

		const patch: Record<string, unknown> = {
			updated_at: new Date(),
		}

		if (input.title !== undefined) patch.title = input.title
		if (input.description !== undefined) patch.description = input.description
		if (input.category !== undefined) patch.category = input.category
		if (input.experienceLevel !== undefined) patch.experience_level = input.experienceLevel
		if (input.budgetType !== undefined) patch.budget_type = input.budgetType
		if (input.budgetMin !== undefined) patch.budget_min = input.budgetMin
		if (input.budgetMax !== undefined) patch.budget_max = input.budgetMax
		if (input.deadline !== undefined) patch.deadline = input.deadline
		if (input.status !== undefined) patch.status = input.status

		const updated = await trx
			.updateTable('projects')
			.set(patch)
			.where('id', '=', projectId)
			.returning(['id', 'title', 'status'])
			.executeTakeFirstOrThrow()

		if (input.skillIds) {
			await replaceProjectSkills(trx, projectId, input.skillIds)
		}

		if (input.attachments) {
			await replaceProjectAttachments(trx, projectId, input.attachments)
		}

		return updated
	})
}

export async function deleteProjectForClient({
	projectId,
	clientId,
}: {
	projectId: string
	clientId: string
}): Promise<boolean> {
	return kysely.transaction().execute(async (trx) => {
		const existing = await trx
			.selectFrom('projects')
			.select(['id', 'client_id', 'status'])
			.where('id', '=', projectId)
			.executeTakeFirst()

		if (!existing || existing.client_id !== clientId) {
			throw new NotFoundError('Project not found')
		}

		const applicationsCountResult = await trx
			.selectFrom('applications')
			.select((eb) => eb.fn.countAll().as('count'))
			.where('project_id', '=', projectId)
			.executeTakeFirstOrThrow()

		const applicationsCount = Number(applicationsCountResult.count)
		if (existing.status !== 'draft' || applicationsCount > 0) {
			throw new ValidationError(
				'Only draft projects without applications can be deleted. Cancel the project instead.',
			)
		}

		const result = await trx
			.deleteFrom('projects')
			.where('id', '=', projectId)
			.executeTakeFirst()
		return Number(result.numDeletedRows ?? 0) > 0
	})
}

export async function createProjectApplicationForFreelancer({
	projectId,
	freelancerId,
	input,
}: {
	projectId: string
	freelancerId: string
	input: CreateApplicationInput
}) {
	const project = await kysely
		.selectFrom('projects')
		.select(['id', 'client_id', 'status', 'deadline', 'budget_min', 'budget_max'])
		.where('id', '=', projectId)
		.executeTakeFirst()

	if (!project) throw new NotFoundError('Project not found')
	if (project.client_id === freelancerId) {
		throw new ValidationError('Нельзя подать заявку на собственный проект')
	}
	if (project.status !== 'published') {
		throw new ValidationError('Приём заявок по этому проекту закрыт')
	}
	if (isProjectExpired(project.deadline)) {
		throw new ValidationError('Приём заявок закрыт: истёк срок проекта')
	}

	if (input.proposedPrice < project.budget_min || input.proposedPrice > project.budget_max) {
		throw new ValidationError(
			'Сумма заявки должна быть в пределах бюджета, указанного в проекте',
			{
				proposedPrice: [
					`Укажите сумму от ${project.budget_min} до ${project.budget_max} (как в карточке проекта)`,
				],
			},
		)
	}

	if (input.proposedDeadline && input.proposedDeadline.getTime() > project.deadline.getTime()) {
		throw new ValidationError('Предлагаемый срок не может быть позже дедлайна проекта', {
			proposedDeadline: ['Выберите дату не позже дедлайна проекта'],
		})
	}

	const existing = await kysely
		.selectFrom('applications')
		.select(['id'])
		.where('project_id', '=', projectId)
		.where('freelancer_id', '=', freelancerId)
		.executeTakeFirst()

	if (existing) {
		throw new ConflictError('Заявка на этот проект уже подана')
	}

	try {
		return await kysely
			.insertInto('applications')
			.values({
				project_id: projectId,
				freelancer_id: freelancerId,
				cover_letter: input.coverLetter,
				proposed_price: input.proposedPrice,
				proposed_deadline: input.proposedDeadline ?? null,
				status: 'submitted',
				updated_at: new Date(),
			})
			.returning([
				'id',
				'project_id as projectId',
				'freelancer_id as freelancerId',
				'cover_letter as coverLetter',
				'proposed_price as proposedPrice',
				'proposed_deadline as proposedDeadline',
				'status',
				'created_at as createdAt',
				'updated_at as updatedAt',
			])
			.executeTakeFirstOrThrow()
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			throw new ConflictError('Заявка на этот проект уже подана')
		}

		throw error
	}
}

export async function listFreelancerApplications({
	freelancerId,
	input,
}: {
	freelancerId: string
	input: ApplicationsQueryInput
}): Promise<ListFreelancerApplicationsResult> {
	const { page, pageSize, status } = input
	const offset = (page - 1) * pageSize

	let countQuery = kysely
		.selectFrom('applications as application')
		.select((eb) => eb.fn.countAll().as('count'))
		.where('application.freelancer_id', '=', freelancerId)

	let rowsQuery = kysely
		.selectFrom('applications as application')
		.innerJoin('projects as project', 'project.id', 'application.project_id')
		.leftJoin('user_profiles as profile', 'profile.user_id', 'project.client_id')
		.select([
			'application.id as id',
			'application.status as status',
			'application.cover_letter as coverLetter',
			'application.proposed_price as proposedPrice',
			'application.proposed_deadline as proposedDeadline',
			'application.created_at as createdAt',
			'application.updated_at as updatedAt',
			'project.id as projectId',
			'project.title as title',
			'project.category as category',
			'project.experience_level as experienceLevel',
			'project.budget_type as budgetType',
			'project.budget_min as budgetMin',
			'project.budget_max as budgetMax',
			'project.deadline as deadline',
			'project.status as projectStatus',
			'project.client_id as clientId',
			'profile.name as name',
			'profile.company_name as companyName',
			'profile.company_role as companyRole',
			'profile.avatar_url as avatarUrl',
		])
		.where('application.freelancer_id', '=', freelancerId)

	if (status) {
		countQuery = countQuery.where('application.status', '=', status)
		rowsQuery = rowsQuery.where('application.status', '=', status)
	}

	const countResult = await countQuery.executeTakeFirstOrThrow()
	const total = Number(countResult.count)
	const rows = await rowsQuery
		.orderBy('application.created_at', 'desc')
		.limit(pageSize)
		.offset(offset)
		.execute()

	if (rows.length === 0) {
		return {
			items: [],
			page,
			pageSize,
			total,
			hasMore: false,
		}
	}

	const skillsByProjectId = await getSkillsByProjectIds(rows.map((row) => row.projectId))

	return {
		items: rows.map((row) => ({
			id: row.id,
			status: row.status,
			coverLetter: row.coverLetter,
			proposedPrice: row.proposedPrice,
			proposedDeadline: row.proposedDeadline,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt,
			project: {
				id: row.projectId,
				href: `/projects/${row.projectId}`,
				title: row.title,
				category: row.category,
				experienceLevel: row.experienceLevel,
				budgetType: row.budgetType,
				budgetMin: row.budgetMin,
				budgetMax: row.budgetMax,
				deadline: row.deadline,
				status: row.projectStatus,
				client: {
					userId: row.clientId,
					name: row.name,
					companyName: row.companyName,
					companyRole: row.companyRole,
					avatarUrl: row.avatarUrl,
				},
				skills: skillsByProjectId.get(row.projectId) ?? [],
			},
		})),
		page,
		pageSize,
		total,
		hasMore: offset + rows.length < total,
	}
}

export async function countClientProjects({ clientId }: { clientId: string }): Promise<number> {
	const result = await kysely
		.selectFrom('projects')
		.select((eb) => eb.fn.countAll().as('count'))
		.where('client_id', '=', clientId)
		.executeTakeFirstOrThrow()

	return Number(result.count)
}

export async function countActiveClientProjectApplications({
	clientId,
}: {
	clientId: string
}): Promise<number> {
	const eligibleApplicationStatuses = ['submitted', 'shortlisted', 'accepted'] as const
	const eligibleProjectStatuses = ['published', 'in_progress'] as const
	const result = await kysely
		.selectFrom('projects as project')
		.innerJoin('applications as application', 'application.project_id', 'project.id')
		.select((eb) => eb.fn.countAll().as('count'))
		.where('project.client_id', '=', clientId)
		.where('project.status', 'in', eligibleProjectStatuses)
		.where('application.status', 'in', eligibleApplicationStatuses)
		.executeTakeFirstOrThrow()

	return Number(result.count)
}

export async function listClientProjectApplications({
	clientId,
}: {
	clientId: string
}): Promise<ListClientProjectApplicationsResult> {
	const eligibleApplicationStatuses = ['submitted', 'shortlisted', 'accepted'] as const
	const eligibleProjectStatuses = ['published', 'in_progress'] as const
	const rows = await kysely
		.selectFrom('projects as project')
		.innerJoin('applications as application', 'application.project_id', 'project.id')
		.leftJoin(
			'user_profiles as freelancer_profile',
			'freelancer_profile.user_id',
			'application.freelancer_id',
		)
		.select([
			'project.id as projectId',
			'project.title as title',
			'project.category as category',
			'project.experience_level as experienceLevel',
			'project.budget_type as budgetType',
			'project.budget_min as budgetMin',
			'project.budget_max as budgetMax',
			'project.deadline as deadline',
			'project.status as projectStatus',
			'application.id as applicationId',
			'application.status as applicationStatus',
			'application.cover_letter as coverLetter',
			'application.proposed_price as proposedPrice',
			'application.proposed_deadline as proposedDeadline',
			'application.created_at as createdAt',
			'application.updated_at as updatedAt',
			'application.freelancer_id as freelancerId',
			'freelancer_profile.name as freelancerName',
			'freelancer_profile.avatar_url as freelancerAvatarUrl',
		])
		.where('project.client_id', '=', clientId)
		.where('project.status', 'in', eligibleProjectStatuses)
		.where('application.status', 'in', eligibleApplicationStatuses)
		.orderBy('project.created_at', 'desc')
		.orderBy('application.created_at', 'desc')
		.execute()

	if (rows.length === 0) {
		return {
			items: [],
		}
	}

	const projectIds = rows.map((row) => row.projectId)
	const skillsByProjectId = await getSkillsByProjectIds(projectIds)
	const itemsByProjectId = new Map<string, ClientProjectApplicationsGroup>()

	for (const row of rows) {
		const existingProject = itemsByProjectId.get(row.projectId)

		if (existingProject) {
			existingProject.applications.push({
				id: row.applicationId,
				status: row.applicationStatus,
				coverLetter: row.coverLetter,
				proposedPrice: row.proposedPrice,
				proposedDeadline: row.proposedDeadline,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
				freelancer: {
					userId: row.freelancerId,
					name: row.freelancerName,
					avatarUrl: row.freelancerAvatarUrl,
				},
			})
			continue
		}

		itemsByProjectId.set(row.projectId, {
			project: {
				id: row.projectId,
				href: `/projects/${row.projectId}`,
				title: row.title,
				category: row.category,
				experienceLevel: row.experienceLevel,
				budgetType: row.budgetType,
				budgetMin: row.budgetMin,
				budgetMax: row.budgetMax,
				deadline: row.deadline,
				status: row.projectStatus,
				skills: skillsByProjectId.get(row.projectId) ?? [],
			},
			applications: [
				{
					id: row.applicationId,
					status: row.applicationStatus,
					coverLetter: row.coverLetter,
					proposedPrice: row.proposedPrice,
					proposedDeadline: row.proposedDeadline,
					createdAt: row.createdAt,
					updatedAt: row.updatedAt,
					freelancer: {
						userId: row.freelancerId,
						name: row.freelancerName,
						avatarUrl: row.freelancerAvatarUrl,
					},
				},
			],
		})
	}

	return {
		items: Array.from(itemsByProjectId.values()),
	}
}

export async function withdrawApplicationForFreelancer({
	applicationId,
	freelancerId,
}: {
	applicationId: string
	freelancerId: string
}) {
	const existing = await kysely
		.selectFrom('applications')
		.select(['id', 'freelancer_id', 'status'])
		.where('id', '=', applicationId)
		.executeTakeFirst()

	if (!existing || existing.freelancer_id !== freelancerId) {
		throw new NotFoundError('Application not found')
	}

	if (!['submitted', 'shortlisted'].includes(existing.status)) {
		throw new ValidationError('Application cannot be withdrawn in its current status')
	}

	return kysely
		.updateTable('applications')
		.set({
			status: 'withdrawn',
			updated_at: new Date(),
		})
		.where('id', '=', applicationId)
		.returning(['id', 'status', 'updated_at as updatedAt'])
		.executeTakeFirstOrThrow()
}

async function getSkillsByProjectIds(projectIds: string[]) {
	const rows = await kysely
		.selectFrom('project_skills as project_skill')
		.innerJoin('skills as skill', 'skill.id', 'project_skill.skill_id')
		.select([
			'project_skill.project_id as projectId',
			'skill.id as id',
			'skill.name as name',
			'skill.category as category',
		])
		.where('project_skill.project_id', 'in', projectIds)
		.orderBy('skill.name', 'asc')
		.execute()

	const map = new Map<string, ProjectSkillSummary[]>()

	for (const row of rows) {
		const items = map.get(row.projectId) ?? []
		items.push({
			id: row.id,
			name: row.name,
			category: row.category,
		})
		map.set(row.projectId, items)
	}

	return map
}

async function getAttachmentsByProjectIds(projectIds: string[]) {
	const rows = await kysely
		.selectFrom('project_attachments')
		.select([
			'project_id as projectId',
			'id',
			'filename',
			'file_url as fileUrl',
			'mime_type as mimeType',
			'file_size_bytes as fileSizeBytes',
			'created_at as createdAt',
		])
		.where('project_id', 'in', projectIds)
		.orderBy('created_at', 'desc')
		.execute()

	const map = new Map<string, ProjectAttachmentSummary[]>()

	for (const row of rows) {
		const items = map.get(row.projectId) ?? []
		items.push({
			id: row.id,
			filename: row.filename,
			fileUrl: row.fileUrl,
			mimeType: row.mimeType,
			fileSizeBytes: row.fileSizeBytes,
			createdAt: row.createdAt,
		})
		map.set(row.projectId, items)
	}

	return map
}

async function replaceProjectSkills(
	db: typeof kysely,
	projectId: string,
	skillIds: string[],
): Promise<void> {
	await db.deleteFrom('project_skills').where('project_id', '=', projectId).execute()

	if (skillIds.length === 0) return

	await db
		.insertInto('project_skills')
		.values(skillIds.map((skillId) => ({ project_id: projectId, skill_id: skillId })))
		.execute()
}

async function replaceProjectAttachments(
	db: typeof kysely,
	projectId: string,
	attachments: ProjectAttachmentInput[],
): Promise<void> {
	await db.deleteFrom('project_attachments').where('project_id', '=', projectId).execute()

	if (attachments.length === 0) return

	await db
		.insertInto('project_attachments')
		.values(
			attachments.map((attachment) => ({
				project_id: projectId,
				filename: attachment.filename,
				file_url: attachment.fileUrl,
				mime_type: attachment.mimeType ?? null,
				file_size_bytes: attachment.fileSizeBytes ?? null,
			})),
		)
		.execute()
}

function toSnippet(value: string, maxLength = 180) {
	const normalized = value.replace(/\s+/g, ' ').trim()
	if (normalized.length <= maxLength) return normalized
	return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

function isProjectExpired(deadline: Date) {
	return deadline.getTime() <= Date.now()
}

const ALLOWED_PROJECT_CREATE_STATUSES: ProjectStatus[] = ['draft', 'published']
const ALLOWED_PROJECT_STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
	draft: ['draft', 'published', 'cancelled'],
	published: ['published', 'in_progress', 'cancelled'],
	in_progress: ['in_progress', 'completed', 'cancelled'],
	completed: ['completed'],
	cancelled: ['cancelled'],
}

function assertAllowedProjectCreateStatus(status: ProjectStatus) {
	if (!ALLOWED_PROJECT_CREATE_STATUSES.includes(status)) {
		throw new ValidationError('New projects can only be created as draft or published')
	}
}

function assertAllowedProjectStatusTransition(
	currentStatus: ProjectStatus,
	nextStatus: ProjectStatus,
) {
	if (currentStatus === nextStatus) {
		return
	}

	if (!ALLOWED_PROJECT_STATUS_TRANSITIONS[currentStatus].includes(nextStatus)) {
		throw new ValidationError(
			`Project status cannot change from ${currentStatus} to ${nextStatus} in the MVP flow`,
		)
	}
}

function isUniqueConstraintError(error: unknown) {
	if (!(error instanceof Error)) {
		return false
	}

	return 'code' in error && error.code === '23505'
}
