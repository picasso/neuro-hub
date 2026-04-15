-- public freelancer profile read model
-- replace <user_id> with a real users.id value
with target as (
	select '<user_id>'::text as user_id
)
select
	fp.id as freelancer_profile_id,
	fp.user_id,
	up.nickname,
	coalesce(up.name, u.name) as display_name,
	up.location,
	up.avatar_url,
	up.bio,
	up.company_name,
	up.company_role,
	fp.specialization,
	fp.hourly_rate,
	fp.availability,
	fp.experience,
	coalesce(skill_agg.skills, '[]'::jsonb) as skills,
	coalesce(portfolio_agg.portfolio_items, '[]'::jsonb) as portfolio_items,
	coalesce(lang_agg.languages, '[]'::jsonb) as languages
from target t
join freelancer_profiles fp on fp.user_id = t.user_id
join users u on u.id = fp.user_id
left join user_profiles up on up.user_id = fp.user_id
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'id', s.id,
			'name', s.name,
			'category', s.category,
			'proficiencyLevel', us.proficiency_level
		)
		order by s.category, s.name, s.id
	) as skills
	from user_skills us
	join skills s on s.id = us.skill_id
	where us.user_id = fp.user_id
) skill_agg on true
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'id', pi.id,
			'title', pi.title,
			'description', pi.description,
			'mediaUrl', pi.media_url,
			'mediaType', pi.media_type,
			'category', pi.category,
			'caption', pi.caption,
			'mediaWidth', pi.media_width,
			'mediaHeight', pi.media_height,
			'toolsUsed', pi.tools_used,
			'createdAt', pi.created_at
		)
		order by pi.created_at desc, pi.id desc
	) as portfolio_items
	from portfolio_items pi
	where pi.freelancer_profile_id = fp.id
) portfolio_agg on true
left join lateral (
	select jsonb_agg(
		jsonb_build_object(
			'code', l.code,
			'name', l.name,
			'nativeName', l.native_name,
			'langLevel', ul.lang_level
		)
		order by l.sort_order, l.name
	) as languages
	from user_languages ul
	join languages l on l.code = ul.language_code
	where ul.user_id = fp.user_id
) lang_agg on true
