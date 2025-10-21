// calculate the time ago a post was created
export function timeAgo(isoDateString) {
    const date = new Date(isoDateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();     // negative if in the past
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    const divisions = [
        { amount: 60, name: 'seconds' },
        { amount: 60, name: 'minutes' },
        { amount: 24, name: 'hours' },
        { amount: 7, name: 'days' },
        { amount: 4.345, name: 'weeks' }, // avg
        { amount: 12, name: 'months' },
        { amount: Number.POSITIVE_INFINITY, name: 'years' }
    ];

    let duration = diff / 1000; // seconds
    for (let i = 0; i < divisions.length; i++) {
        const { amount, name } = divisions[i];
        if (Math.abs(duration) < amount) {
            return rtf.format(Math.round(duration), name.slice(0, -1));
        }
        duration /= amount;
    }
}
