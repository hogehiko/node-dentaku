import * as chai from 'chai';

import * as parser from '../src/parser';

describe('token', () => {

    it('should work with number', () => {
        let result = parser.number.parse(new parser.InputBuffer("10"));
        chai.assert.deepEqual(result.get, new parser.TreeLeaf({label: 'number', token: '10'}))
    })
});

describe('InputBuffer', () => {
    it('should return true if given regexp is matched', ()=>{
        let buf =new  parser.InputBuffer(" aaa bbb");
        chai.assert.isTrue(buf.match(/aaa/))
        chai.assert.isFalse(buf.match(/bbb/))
    })

    it('should remove token from head of input string after calling next', ()=>{
        let buf =new  parser.InputBuffer(" aaa bbb");
        buf.next(/aaa/)
        chai.assert.isTrue(buf.match(/bbb/))
    })
});