-- public/general project read model
-- replace <project_id> with a real projects.id value
with target as (
	select '<project_id>'::uuid as project_id
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
	coalesce(attachment_agg.attachments, '[]'::jsonb) as attachments
from target t
join projects p on p.id = t.project_id
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
