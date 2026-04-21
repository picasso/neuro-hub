'use client'

import { useUnit } from 'effector-react'
import { $selectedSkills } from '@/features/skills/model'
import { SkillsPicker } from '@/features/skills/skills-picker'
import { nextStep, prevStep } from '@/stores'
import { Button, Stack, TS } from '@/ui'

export function SkillsSelectionStep() {
	const [selectedSkills] = useUnit([$selectedSkills])

	const onContinue = () => {
		if (selectedSkills.length > 0) {
			nextStep()
		}
	}

	return (
		<div>
			<div className="mb-8 text-center">
				<TS variant="h5" gutterBottom content="Выберите ваши навыки" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Отметьте навыки, которыми вы владеете"
				/>
			</div>

			<div className="max-w-200 mx-auto">
				<div className="mb-6">
					<SkillsPicker />
				</div>

				<Stack justify="space-between">
					<Button variant="outline" size="lg" onClick={() => prevStep()} label="Назад" />
					<Button
						size="lg"
						onClick={onContinue}
						disabled={selectedSkills.length === 0}
						label="Продолжить"
					/>
				</Stack>
			</div>
		</div>
	)
}
