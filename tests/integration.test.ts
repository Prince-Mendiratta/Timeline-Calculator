import {describe, expect, test} from '@jest/globals';
import addTimelineDetails from '../src/index';
import CONST from '../src/const';

describe('Test Module', () => {
    test('PR merged in 2 business days', async () => {
        expect(await addTimelineDetails('https://github.com/Expensify/App/issues/14307', 'https://github.com/Expensify/App/pull/15245')).toBe(CONST.BONUS);
    });
    test('PR merged in more than 3 business days', async () => {
        expect(await addTimelineDetails('https://github.com/Expensify/App/issues/14936', 'https://github.com/Expensify/App/pull/15033')).toBe(CONST.NO_BONUS);
    });
})