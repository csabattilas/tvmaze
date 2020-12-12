module.exports = {
    Query: {
        schedule: (_, {settings}, {dataSources}) =>
            dataSources.tvMazeApi.getWeekSchedule(settings.isNextWeek, settings.countryCode, settings.rating),
        show: (_, {id}, {dataSources}) =>
            dataSources.tvMazeApi.getShowById(id)
        ,
        shows: (_, {q}, {dataSources}) =>
            dataSources.tvMazeApi.getShowsByQuery(q)
    },
    Show: {
        episodes: (_, {id}, {dataSources}) =>
            dataSources.tvMazeApi.getEpisodesById(id),

        cast: (_, {id}, {dataSources}) =>
            dataSources.tvMazeApi.getCastById(id)
    },
};
