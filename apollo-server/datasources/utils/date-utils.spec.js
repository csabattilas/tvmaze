describe('Date utilities', () => {
    let mockDate = new Date(1607977802129);
    let DateUtils;

    beforeEach(() => {
        DateUtils = require('./date-utils');

        spy = jest
            .spyOn(DateUtils, 'today')
            .mockImplementation(() => mockDate)
    });

    it('My Test Case', () => {
        expect(DateUtils.getDaysTillEndOfWeek()).toEqual(6);
    });
});
