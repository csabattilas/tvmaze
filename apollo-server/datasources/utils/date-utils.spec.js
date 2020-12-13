describe('Date utilities', () => {
    let mockDate = new Date(1607855758401);
    let DateUtils;

    beforeEach(() => {
        DateUtils = require('./date-utils');

        spy = jest
            .spyOn(DateUtils, 'today')
            .mockImplementation(() => mockDate)
    });

    it('My Test Case', () => {
        expect(DateUtils.getDaysTillEndOfWeek()).toEqual(7);
    });
});
