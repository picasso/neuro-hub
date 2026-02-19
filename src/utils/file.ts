export function fileSize(size: number, round: number = 2, binary: boolean = false): string {
	const div = binary ? 1024 : 1000
	const fileSize = Math.abs(size)
	if (fileSize < div) return fileSize + ' B'
	else if (fileSize < div * div) return (fileSize / div).toFixed(round) + ' KB'
	else if (fileSize < div * div * div) return (fileSize / (div * div)).toFixed(round) + ' MB'
	else return (fileSize / (div * div * div)).toFixed(round) + ' GB'
}
