class DateUtils {

    /**
     *
     * Get days till the end of week from the current day
     *
     * @returns {number}
     */
    static getDaysTillEndOfWeek() {
        const DAY_IN_MS = 24 * 60 * 60 * 1000;
        const today = DateUtils.today();

        const weekendDay = today.getDate() - (today.getDay() - 1) + 6;

        const weekendDate = (new Date(new Date().setDate(weekendDay))).toISOString().slice(0, 10);

        const startDate = DateUtils.today().toISOString().slice(0, 10);

        const diffInMs = new Date(weekendDate) - new Date(startDate);

        return diffInMs / DAY_IN_MS;
    }

    static addDay(date, day) {
        return new Date(date.getTime() + day * 24 * 60 * 60* 1000);
    }

    static today() {
        return new Date();
    }
}

module.exports = DateUtils;
