fdescribe('TvMaze Api', () => {
    let mockDate = new Date(1607977802129);
    let DateUtils;
    let TvMazeApi;

    let tvMazeApi;

    describe('getWeekSchedule', () => {
        beforeEach(() => {
            DateUtils = require('./utils/date-utils');
            TvMazeApi = require('./tvmaze-api');

            tvMazeApi = new TvMazeApi();

            spyDateUtil = jest
                .spyOn(DateUtils, 'today')
                .mockImplementation(() => mockDate);

            spySetScheduleDaySchedule = jest
                .spyOn(tvMazeApi, 'getScheduleDaySchedule')
                .mockImplementation((date, country, rating) => {
                    if (date.getTime() === 1607977802129) {
                        return [
                            {
                                id: 12,
                                name: 'show1',
                                genre: 'Comedy',
                                rating: '6',
                                airdate: '2020-12-14',
                                airtime: '10:00',
                                image: 'http://image-medium.jpg'
                            },
                            {
                                id: 13,
                                name: 'show2',
                                genre: 'Comedy',
                                rating: '5',
                                airdate: '2020-12-14',
                                airtime: '14:00',
                                image: 'http://image-medium.jpg'
                            },
                            {
                                id: 13,
                                name: 'show3',
                                genre: 'Comedy',
                                rating: '0',
                                airdate: '2020-12-14',
                                airtime: '11:00',
                                image: 'http://image-medium.jpg'
                            }
                        ]
                    } else {
                        return [
                            {
                                id: 12,
                                name: 'show11',
                                genre: 'Comedy',
                                rating: '6',
                                airdate: '2020-12-14',
                                airtime: '10:00',
                                image: 'http://image-medium.jpg'
                            },
                            {
                                id: 13,
                                name: 'show21',
                                genre: 'Comedy',
                                rating: '5',
                                airdate: '2020-12-15',
                                airtime: '14:00',
                                image: 'http://image-medium.jpg'
                            },
                            {
                                id: 133,
                                name: 'show31',
                                genre: 'Comedy',
                                rating: '0',
                                airdate: '2020-12-14',
                                airtime: '11:00',
                                image: 'http://image-medium.jpg'
                            }
                        ]
                    }
                });
        });

        it('should call getScheduleDaySchedule as many times as the days are till the end of the current week', () => {
            tvMazeApi.getWeekSchedule(false, 'US', 6);
            expect(spySetScheduleDaySchedule).toBeCalledTimes(6);
        });

        it('should call getScheduleDaySchedule as many times as the days are till the end of the next week', () => {
            tvMazeApi.getWeekSchedule(true, 'US', 6);
            expect(spySetScheduleDaySchedule).toBeCalledTimes(7);
        });

        it('should return the reduced data with unique ids', async () => {
            const data = await tvMazeApi.getWeekSchedule(false, 'US', 6)

            expect(data).toBeDefined();
            expect(data.length).toBe(3); // even if it called many times 6 calls will be the same will have the same ids
            expect(data.find(item => item.id === 12)).toBeDefined();
        });
    });

    describe('rate parsing', () => {
        it('should parse rates accordingly', () => {
            expect(TvMazeApi.parseRating(5)).toBe(5);
            expect(TvMazeApi.parseRating({average: 2})).toBe(2);
            expect(TvMazeApi.parseRating({average: 0})).toBe(0);
            expect(TvMazeApi.parseRating(null)).toBe(0);
            expect(TvMazeApi.parseRating(undefined)).toBe(0);
            expect(TvMazeApi.parseRating({})).toBe(0);
        })
    });
});
