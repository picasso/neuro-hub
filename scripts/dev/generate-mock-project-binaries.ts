/**
 * Writes PDF, DOCX, MP4, M4A mock attachments into public/mock-projects/.
 * Output names: attachment-* only. Video/audio: ffmpeg-static or PATH ffmpeg.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import JSZip from 'jszip'
import { PDFDocument, StandardFonts, type PDFFont, type PDFPage } from 'pdf-lib'
import { printEmpty, printError, printSection, printSuccess } from '../utils/cli-utils'

const require = createRequire(import.meta.url)

const OUT_DIR = resolve(process.cwd(), 'public/mock-projects')

const RAG_NDA_PARAS = [
	'Synthetic document for NeuroGig local QA only. Not a legally binding NDA.',
	'',
	'1. Pilot scope',
	'Internal RAG pilot over SOPs, an incident log, and engineering drawings. No production fine-tuning without written approval; model weights stay private to the tenant.',
	'',
	'2. Data handling',
	'Sources: Confluence export, regulation PDFs, Jira tickets via read-only connector. PII is masked at indexing time. Request logs retained 90 days; production logs store hashes and metadata, not raw user prompts.',
	'',
	'3. Answer boundaries',
	'The assistant must cite a source paragraph or reply that no allowed source supports the claim. Invented clause numbers are forbidden. If two document versions conflict, the later approved revision wins.',
	'',
	'4. Human escalation',
	'Route to an operator when confidence is below threshold, multiple equally ranked sources appear, or the question is outside the SOP catalog. Business-hours SLA: first human touch within 15 minutes.',
	'',
	'5. Acceptance criteria',
	'Hold-out set of 200 questions; fraction with correct citation >= 85%. Zero false citations on blocking scenarios. p95 latency under 4 seconds at the current index size.',
	'',
	'6. Rollout checklist',
	'Staging sign-off from security, data owner, and product. Canary on 5% of users for one week before full enablement. Rollback playbook tested once per quarter.',
]

const RAG_THREAT_PARAS = [
	'Synthetic briefing for regulated RAG QA (NeuroGig mock). Not legal advice.',
	'',
	'Threat model (summary)',
	'Cross-tenant leakage: strict index separation per tenant_id. Prompt injection from user uploads: sanitize extracted text; never execute code embedded in retrieved chunks.',
	'',
	'Citation policy',
	'Any statement framed as "per policy X" must carry an anchor (file, page, snippet). Low retriever score requires an explicit refusal and a pointer to the policy owner.',
	'',
	'Audit and retention',
	'Assistant-driven document views append to an audit log (user, tenant, doc id, timestamp). Quarterly log export for compliance. Data-subject deletion tickets trigger index rebuild within 72 hours.',
	'',
	'Red team',
	'Fifty adversarial prompts are excluded from fine-tuning. Monthly staging runs; new critical findings block release until remediated.',
	'',
	'Sign-off',
	'Product owner, security officer, and DPO (if applicable) approve pilot in the segmented environment. Document version tracked alongside MOCK-PROJECTS data.',
	'',
	'Operational metrics',
	'Track refusal rate, average citation depth, and drift between keyword baseline and RAG answers. Alert if refusal rate drops sharply without an approved model change.',
]

const MOBILE_PRD_LINES = [
	'NeuroGig mock — фрагмент PRD: LLM в B2B mobile (MVP+1)',
	'Версия документа: 0.3 (синтетика для QA)',
	'',
	'1. Проблема',
	'Менеджеры B2B проводят длинные сессии в приложении; им нужны безопасные подсказки, краткое резюме чата и шаблоны ответов без утечки данных клиента в общую модель.',
	'',
	'2. Цели и метрики',
	'Time-to-first-useful-suggestion < 30 с после включения функции. Доля сессий с явным «отказом модели» при отсутствии контекста ≥ 5 % (честность). NPS сегмента power users не ниже базовой линии до фичи.',
	'',
	'3. Объём MVP+1',
	'Включено: саммари сессии (до 2k токенов контекста), три утверждённых шаблона ответа, feature flags по tenant и по пользователю. Исключено: обучение кастомных весов, голосовой ввод, офлайн-режим для LLM.',
	'',
	'4. UX и доверие',
	'Каждый ответ с меткой «сгенерировано» и ссылкой на политику. Кнопка «сообщить о проблеме» шлёт в Slack канал продукта без текста клиента по умолчанию. Состояние загрузки и деградации при таймауте API — см. макеты Figma (вне мока).',
	'',
	'5. Риски',
	'Store review: формулировки про ИИ согласовать с юристом. Утечка API-ключей — только через backend BFF, ключи не в мобильном бандле.',
	'',
	'6. Открытые вопросы',
	'Нужна ли двухфакторная смена настроек LLM? Лимиты расхода токенов на tenant — кто администрирует?',
]

const MOBILE_CHECKLIST_LINES = [
	'NeuroGig mock — чек-лист интеграции mobile + LLM',
	'',
	'Безопасность и конфигурация',
	'[ ] Секреты только в vault; CI не содержит ключей.',
	'[ ] BFF валидирует JWT и tenant_id на каждый запрос к модели.',
	'[ ] Rate limiting по пользователю и по tenant включён на staging.',
	'',
	'Продукт и соответствие',
	'[ ] Тексты раскрытия ИИ согласованы с legal (EN + локаль основного рынка).',
	'[ ] Логи без PII; маскирование email/телефона в промежуточных слоях.',
	'[ ] Feature flag «LLM assistant» по умолчанию off для существующих клиентов.',
	'',
	'Надёжность',
	'[ ] Таймаут вызова модели ≤ 12 с; показ fallback-карточки с контактом поддержки.',
	'[ ] Алерт в PagerDuty при доле 5xx > 1 % за 15 мин.',
	'[ ] Кэш саммари с инвалидацией при новых сообщениях в треде.',
	'',
	'Тестирование',
	'[ ] E2E: happy path, таймаут API, отключённый флаг, пустой контекст.',
	'[ ] Нагрузочный тест на hold-out наборе промптов без прод-данных.',
	'',
	'Подпись: _________________  Дата: __________',
]

const PROMPT_PLAYBOOK_LINES = [
	'NeuroGig mock — playbook спринта по промптам (4 недели)',
	'',
	'Неделя 1 — Инвентаризация',
	'Собрать все промпты из Notion, репозитория и админки. Для каждого: владелец, окружение (prod/stage), последняя дата изменения. Пометить устаревшие и дубликаты.',
	'',
	'Неделя 2 — Качество и регрессия',
	'Собрать набор из минимум 100 пар «вход — ожидаемые свойства ответа» (не обязательно дословное совпадение). Автоматический прогон при каждом PR, меняющем промпты. Классы ошибок: hallucination, tone, policy, format.',
	'',
	'Неделя 3 — Владение и доступ',
	'Ввести CODEOWNERS на каталоги промптов. Обязательный review от domain-эксперта для промптов, влияющих на биллинг или compliance.',
	'',
	'Неделя 4 — Handoff и обучение',
	'Одностраничный runbook для L&D: где смотреть метрики, как откатить версию промпта, куда писать об инциденте. Воркшоп 60 минут для внутренних заказчиков.',
	'',
	'Приложение A — Шаблон тикета на изменение промпта',
	'Описание изменения / обоснование / риски / ссылка на eval PR / согласование владельца продукта.',
]

function resolveFfmpegBin(): string {
	const fromPkg = require('ffmpeg-static') as string | null
	if (fromPkg) {
		return fromPkg
	}
	return 'ffmpeg'
}

function ensureFfmpeg(bin: string) {
	try {
		execFileSync(bin, ['-version'], { stdio: 'pipe' })
	} catch {
		throw new Error(
			`ffmpeg not runnable at "${bin}" (install devDependency ffmpeg-static or put ffmpeg on PATH)`,
		)
	}
}

function escapeXml(text: string) {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

async function writeDocx(outPath: string, lines: string[]) {
	const body = lines
		.map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`)
		.join('')
	const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${body}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body>
</w:document>`
	const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`
	const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
	const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"/>`

	const zip = new JSZip()
	zip.file('[Content_Types].xml', contentTypes)
	zip.folder('_rels')!.file('.rels', rels)
	const word = zip.folder('word')!
	word.file('document.xml', documentXml)
	word.folder('_rels')!.file('document.xml.rels', docRels)

	const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
	writeFileSync(outPath, buf)
}

function wrapToLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
	const words = text.split(/\s+/).filter(Boolean)
	const lines: string[] = []
	let line = ''
	for (const word of words) {
		const test = line ? `${line} ${word}` : word
		if (font.widthOfTextAtSize(test, size) <= maxWidth) {
			line = test
		} else {
			if (line) lines.push(line)
			line = word
		}
	}
	if (line) lines.push(line)
	return lines
}

async function writePdf(outPath: string, title: string, paragraphs: string[]) {
	const doc = await PDFDocument.create()
	const font = await doc.embedFont(StandardFonts.Helvetica)
	const left = 50
	const maxW = 512
	const sizeTitle = 14
	const sizeBody = 10
	const lineH = 14
	const bottom = 60

	let page: PDFPage = doc.addPage([612, 792])
	let y = 750

	const newPage = () => {
		page = doc.addPage([612, 792])
		y = 750
	}

	page.drawText(title, { x: left, y, size: sizeTitle, font })
	y -= sizeTitle + 14

	for (const para of paragraphs) {
		if (para === '') {
			y -= lineH * 0.5
			continue
		}
		const lines = wrapToLines(para, font, sizeBody, maxW)
		for (const ln of lines) {
			if (y < bottom) newPage()
			page.drawText(ln, { x: left, y, size: sizeBody, font })
			y -= lineH
		}
		y -= 6
	}

	const bytes = await doc.save()
	writeFileSync(outPath, bytes)
}

function runFfmpegMp4(ffmpegBin: string, outName: string, lavfiInput: string) {
	const out = resolve(OUT_DIR, outName)
	execFileSync(
		ffmpegBin,
		[
			'-y',
			'-f',
			'lavfi',
			'-i',
			lavfiInput,
			'-c:v',
			'libx264',
			'-pix_fmt',
			'yuv420p',
			'-t',
			'2',
			out,
		],
		{ stdio: 'pipe' },
	)
}

function runFfmpegM4a(ffmpegBin: string, outName: string) {
	const out = resolve(OUT_DIR, outName)
	execFileSync(
		ffmpegBin,
		[
			'-y',
			'-f',
			'lavfi',
			'-i',
			'sine=frequency=440:sample_rate=44100',
			'-t',
			'2',
			'-c:a',
			'aac',
			'-b:a',
			'96k',
			out,
		],
		{ stdio: 'pipe' },
	)
}

async function main() {
	printEmpty()
	printSection('Generate mock project binaries')
	mkdirSync(OUT_DIR, { recursive: true })
	const ffmpegBin = resolveFfmpegBin()
	ensureFfmpeg(ffmpegBin)

	await writePdf(
		resolve(OUT_DIR, 'attachment-rag-nda-brief.pdf'),
		'RAG pilot — NDA context (NeuroGig mock)',
		RAG_NDA_PARAS,
	)

	await writePdf(
		resolve(OUT_DIR, 'attachment-rag-threat-brief.pdf'),
		'Regulated RAG — threat and citation notes (mock)',
		RAG_THREAT_PARAS,
	)

	await writeDocx(resolve(OUT_DIR, 'attachment-mobile-prd-excerpt.docx'), MOBILE_PRD_LINES)

	await writeDocx(
		resolve(OUT_DIR, 'attachment-mobile-integration-checklist.docx'),
		MOBILE_CHECKLIST_LINES,
	)

	await writeDocx(resolve(OUT_DIR, 'attachment-prompt-playbook.docx'), PROMPT_PLAYBOOK_LINES)

	runFfmpegMp4(ffmpegBin, 'attachment-video-perf-hero-a.mp4', 'smptebars=size=320x240:rate=30')
	runFfmpegMp4(
		ffmpegBin,
		'attachment-video-perf-hero-b.mp4',
		'color=c=0x224466:size=320x240:rate=30',
	)
	runFfmpegM4a(ffmpegBin, 'attachment-store-faq-sample.m4a')

	printSuccess(`Wrote mock binaries to ${OUT_DIR}`)
	printEmpty()
}

main().catch((e) => {
	printEmpty()
	printError(e instanceof Error ? e.message : String(e))
	printEmpty()
	process.exit(1)
})
