const date_to = {
	short_month: date => date.toLocaleString('en-US', { month: 'short' }),
	hours_12: date => date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }),
	short_year: date => date.toLocaleString('en-US', { year: '2-digit' })
}

export const date_to_format = (date_raw, type) => {
	const date = typeof(date_raw) === 'string' ? new Date(date_raw) : date_raw;
	switch (type) {
		case 'date_shortened':
			return `${date_to.short_month(date)} ${date.getDate()}, ${date.getFullYear()}`;
		case 'date_short_time_full':
			return `${date.getMonth() + 1}/${date.getDate()}/${date_to.short_year(date)}, ${date_to.hours_12(date)}`;
		default:
			return date;
	}
}
