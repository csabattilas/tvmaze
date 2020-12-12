const {RESTDataSource} = require('apollo-datasource-rest');
const DateUtils = require('./utils/date-utils');

class TvMazeApi extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.tvmaze.com';
    }

    /**
     * Get shows (schedule) data for a day.
     * @param date
     * @param country
     * @param rating
     * @returns {Promise<Array>}
     */
    async getScheduleDaySchedule(date, country, rating) {
        const response = await this.get(
            'schedule',
            {
                date: date.toISOString().slice(0, 10),
                country
            }
        );

        return Array.isArray(response)
            ? response.map(show => TvMazeApi.schedulerReducer(show))
                .filter(show =>  show.rating >= rating)
            : [];
    }

    /**
     *
     * Get shows (schedule) data for more than one date using Promise.all
     * TvMaze only allows to fetch shows per day per country or full but I wanted to fetch shows for current or next week.
     *
     * This was the reason that I made this small middleware as well, as I wanted to hide away this logic from the client
     *
     * @param isNextWeek
     * @param country
     * @param rating
     * @returns {Promise<any>}
     */
    async getWeekSchedule(isNextWeek, country, rating) {
        let dates = [];
        let startDay = 0;
        let endDay = DateUtils.getDaysTillEndOfWeek();

        // current vs next week logic
        if(isNextWeek) {
            startDay = endDay;
            endDay = startDay + 7
        }

        for(let day = startDay; day < endDay; day++) {
            dates.push(DateUtils.addDay(new Date(), day));
        }

        let response = await Promise.all(
            dates.map(date => this.getScheduleDaySchedule(date, country, rating)),
        );

        response = Array.isArray(response)
            ? response.flat(1) : [];

        return response.length
            ? response.filter((show, index) => response.findIndex(showByIndex => showByIndex.id === show.id) === index)
            : [];
    }

    /**
     *
     * Get shows data via search query
     *
     * @param q
     * @returns {Promise<Array>}
     */
    async getShowsByQuery(q) {
        const response = await this.get(
            `search/shows`,
            {
                q
            }
        );

        return Array.isArray(response)
            ? response.map(show => TvMazeApi.schedulerReducer(show))
            : [];
    }

    /**
     *
     * Get show data by show id. Used for the details for a show
     *
     * @param id
     * @returns {Promise<any>}
     */
    async getShowById(id) {
        return await this.get(
            `shows/${id}`,
        );
    }

    /**
     *
     * Get upcoming episodes for a show. Will fetch all the episodes then I slice the first 2
     *
     * @param id
     * @returns {Promise<Array>}
     */
    async getEpisodesById(id) {
        const response = await this.get(
            `shows/${id}/episodes`,
        );

        return Array.isArray(response)
            ? response.filter(episode => {
                return new Date(episode.airdate).getTime() > new Date().getTime()
            }).slice(0, 2)
            : [];
    }

    /**
     *
     * Get cast info for a show. Will fetch all casts data then I slice first 5
     *
     * @param id
     * @returns {Promise<Array>}
     */
    async getCastById(id) {
        const response = await this.get(
            `shows/${id}/cast`,
        );

        return Array.isArray(response)
            ? response.slice(0, 5).map(cast => TvMazeApi.castReducer(cast))
            : [];
    }


    /**
     * Reducer to shape show data
     *
     * @param showItem
     * @returns {{airtime: *, image: *, airdate: *, name: *, genre: string | * | string, rating: *, id: *}}
     */
    static schedulerReducer(showItem) {
        const show = (showItem || {}).show; // todo would be nice typescript to use `?` here

        return {
            id: show.id,
            name: show.name,
            // taking only the first genre for simplicity
            genre: (show.genres || [])[0] || 'Various',
            rating: TvMazeApi.parseRating(show.rating),
            airdate: showItem.airdate,
            airtime: showItem.airtime,
            image: show.image
        };
    }

    /**
     * Reducer to shape cast data
     *
     * @param cast
     * @returns {{name: *}|{name: string}}
     */
    static castReducer(cast) {
        if(cast.person) {
            return { name: cast.person.name };
        } else {
            return { name: ''};
        }
    }

    /**
     * Rating parser. The rating is not consistent type. Needs to be parsed to be able to always send back number
     * @param rating
     * @returns {number|*}
     */
    static parseRating(rating) {
        if(typeof rating !== "object") {
            return rating;
        } else if(rating.hasOwnProperty('average') && !!rating.average ) {
           return rating.average;
        } else {
            return 0;
        }
    }
}

module.exports = TvMazeApi;
