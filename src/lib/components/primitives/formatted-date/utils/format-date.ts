export function formatDate(iso: string, locale: string): string {
	const date = new Date(iso);
	const month = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(date);
	return `${date.getUTCDate()} ${month} ${date.getUTCFullYear()}`;
}
