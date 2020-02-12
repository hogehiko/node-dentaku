import * as chai from 'chai';

import * as parser from '../src/parser';
import { Parser } from '../src/app';
import { some, none } from 'ts-option';

describe('token', () => {

    it('should work with number', () => {
        let result = parser.number.parse(new parser.InputBuffer("10"));
        chai.assert.deepEqual(result.get, new parser.TreeLeaf({label: 'number', token: '10'}))
    })

    it('should work with operators', () => {
        let result = parser.addsub_op.parse(new parser.InputBuffer("+"));
        chai.assert.deepEqual(result.get, new parser.TreeLeaf({label: 'addsub_op', token: '+'}))
    })

    it('should work with operators2', () => {
        let result = parser.muldiv_op.parse(new parser.InputBuffer("*"));
        chai.assert.deepEqual(result.get, new parser.TreeLeaf({label: 'muldiv_op', token: '*'}))
    })
});

describe('repeat', () => {
    it('works', () => {
        // head 判定できているか
        let input = new parser.InputBuffer("1 2 3");
        let repeat_parser = parser.repeat(parser.number);
        chai.assert.deepEqual(repeat_parser.head(input), some(new parser.TreeLeaf({'label': 'number', 'token':'1'})));
        chai.assert.deepEqual(repeat_parser.defs[0], parser.number);

        let input2 = new parser.InputBuffer("1 2 3");
        let result = repeat_parser.parse(input2);
        chai.assert.deepEqual(result.get, new parser.TreeEntrySequence(
            {entries: [
                new parser.TreeLeaf({'label': 'number', 'token':'1'}),
                new parser.TreeLeaf({'label': 'number', 'token':'2'}),
                new parser.TreeLeaf({'label': 'number', 'token':'3'})]
            }));
    })
    it('should work with muldiv_exp', () => {
        chai.assert.equal(parser.muldiv_exp.defs.length, 2);
        chai.assert.equal((parser.muldiv_exp.defs[1] as parser.Repeat).defs.length, 2);
        let result = parser.muldiv_exp.parse(new parser.InputBuffer("1*2"));
        chai.assert.deepEqual(result.get, new parser.TreeNode({label: 'muldiv_exp', children: [
            new parser.TreeLeaf({label: 'number', token: '1'}),
            new parser.TreeLeaf({label: 'muldiv_op', token: '*'}),
            new parser.TreeLeaf({label: 'number', token: '2'})
            
        ]}))
    })

    it('should work with addsub_exp', () => {
        let result = parser.addsub_exp.parse(new parser.InputBuffer("3+1*2"));
        chai.assert.deepEqual(result.get,
            new parser.TreeNode({
                label: 'addsub_exp',
                children:[
                    new parser.TreeLeaf({label: 'number', token: '3'}),
                    new parser.TreeLeaf({label: 'addsub_op', token: '+'}),
                    new parser.TreeNode({label: 'muldiv_exp', children: [
                        new parser.TreeLeaf({label: 'number', token: '1'}),
                        new parser.TreeLeaf({label: 'muldiv_op', token: '*'}),
                        new parser.TreeLeaf({label: 'number', token: '2'})
                        
                    ]})]
                }));
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

    it('should work without ws', () =>{
        let buf = new parser.InputBuffer("1_2");
        chai.assert.deepEqual(buf.next(/1/), '1');
        chai.assert.deepEqual(buf.next(/_/), '_');
        chai.assert.deepEqual(buf.next(/2/), '2');
    })
});