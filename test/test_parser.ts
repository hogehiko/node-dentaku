import * as chai from 'chai';

import * as parser from '../src/parser';

describe('token', () => {

    it('should work with number', () => {
        let result = parser.number.parse(new parser.InputBuffer("10"));
        chai.assert.equal(result.get, new parser.TreeLeaf({label: 'number', token: '10'}))
    })
});