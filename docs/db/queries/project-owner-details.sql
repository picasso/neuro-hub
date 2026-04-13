-- owner/internal project read model
-- use this when the project owner needs attachment, skill, and application details
-- replace <project_id> and <client_id> with real ids
-- this example demonstrates owner scoping via projects.client_id
with target as (
	select
		'<project_id>'::uuid as project_id,
		'<client_id>'::uuid as client_id
)
select
	p.id,
	p.client_id,
	client.name as client_name,
	p.title,
	p.description,
	p.category,
	p.experience_level,
	p.budget_type,
	p.budget_min,
	p.budget_max,
	p.deadline,
	p.status,
	p.created_at,
	p.updated_at,
	coalesce(required_skill_agg.required_skills, '[]'::jsonb) as required_skills,
	coalesce(attachment_agg.attachments, '[]'::jsonb) as attachments,
	coalesce(application_agg.application_count, 0) as application_count,
	coalesce(application_agg.applications, '[]'::jsonb) as applications
from target t
join projects p on p.id = t.project_id and p.client_id = t.client_id
join users client on client.id = p.client_id
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'id', s.id,
			'name', s.name,
			'category', s.category
		)
		order by s.category, s.name, s.id
	) as required_skills
	from project_skills ps
	join skills s on s.id = ps.skill_id
	where ps.project_id = p.id
) required_skill_agg on true
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'id', pa.id,
			'filename', pa.filename,
			'fileUrl', pa.file_url,
			'mimeType', pa.mime_type,
			'fileSizeBytes', pa.file_size_bytes,
			'createdAt', pa.created_at
		)
		order by pa.created_at, pa.id
	) as attachments
	from project_attachments pa
	where pa.project_id = p.id
) attachment_agg on true
left join lateral (
	select
		count(*)::integer as application_count,
		coalesce(
			jsonb_agg(
				jsonb_build_object(
					'id', a.id,
					'freelancerId', a.freelancer_id,
					'freelancerName', u.name,
					'profileName', up.name,
					'avatarUrl', up.avatar_url,
					'freelancerSpecialization', fp.specialization,
					'coverLetter', a.cover_letter,
					'proposedPrice', a.proposed_price,
					'proposedDeadline', a.proposed_deadline,
					'status', a.status,
					'createdAt', a.created_at
				)
				order by a.created_at desc, a.id desc
			),
			'[]'::jsonb
		) as applications
	from applications a
	join users u on u.id = a.freelancer_id
	left join user_profiles up on up.user_id = a.freelancer_id
	left join freelancer_profiles fp on fp.user_id = a.freelancer_id
	where a.project_id = p.id
) application_agg on true
