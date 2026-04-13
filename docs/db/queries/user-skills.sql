-- replace <user_id> with a real users.id value
select
	u.id as user_id,
	u.name as user_name,
	u.role,
	s.id as skill_id,
	s.name as skill_name,
	s.category as skill_category,
	us.proficiency_level,
	us.created_at as linked_at
from users u
join user_skills us on us.user_id = u.id
join skills s on s.id = us.skill_id
where u.id = '<user_id>'
order by
	s.name asc,
	us.created_at asc
