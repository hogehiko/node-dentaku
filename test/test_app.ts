import * as chai from 'chai';

import { Parser, calc } from '../src/app';

describe('parser test', () => {

    it('should do nothing', () => {
        // Errorがthrowされることを確認
        console.log("hoge")
        chai.assert(7 === calc("1 + 2 * 3"))
    })
});