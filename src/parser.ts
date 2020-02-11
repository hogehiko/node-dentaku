import Record from 'dataclass';
import {Option, option, some, none} from "ts-option";
import { Parser } from './app';

export interface TreeEntry{
}


export interface LabeledTreeEntry extends TreeEntry{
    label: string
}

export class TreeNode extends Record<TreeNode> implements LabeledTreeEntry{
    label: string = ''
    children: TreeEntry[] = []
}

export class TreeLeaf extends Record<TreeLeaf> implements LabeledTreeEntry{
    label: string = ''
    token: string = ''
}

export class TreeEntrySequence extends Record<TreeEntrySequence> implements TreeEntry{
    entries: TreeEntry[]
}

export class Def{
    parse(buf:InputBuffer): Option<TreeEntry>{
        return none
    }
}



export class NodeLebelDef extends Def{
    symbol: string
    constructor(symbol: string){
        super()
        this.symbol = symbol
    }
}

export class Token extends NodeLebelDef{
    regexp: RegExp
    constructor(symbol: string, regexp:RegExp){
        super(symbol)
        this.regexp = regexp
    }

    parse(buf: InputBuffer): Option<TreeEntry>{
        if(buf.match(this.regexp)){
            let token = buf.next(this.regexp);
            return some(new TreeLeaf({label: this.symbol, token: token}))
        }else{
            return none;
        }
    }
}

export class StdNode extends NodeLebelDef{
    defs: Def[]
    constructor(symbol: string, arg: Def[]){
        super(symbol)
        this.defs=arg
    }

    parse(buf: InputBuffer): Option<TreeEntry>{
        let result: TreeEntry[] = [];
        for(let d of this.defs){
            result.push(d.parse(buf).get)
        }
        return some(new TreeNode({label: this.symbol, children: result}))
    }
}

export class Choice extends Def{
    constructor(arg: Def[]){
        super()
    }
}

export class Repeat extends Def{
    defs: Def[]
    constructor(arg: Def[]){
        super()
        this.defs = arg
    }

    parse(buf: InputBuffer): Option<TreeEntry>{
        let result: TreeEntry[] = [];
        while(true){
            let head = this.defs[0].parse(buf)
            if(head.isEmpty){
                break;
            }
            result.push(head.get);
            for(let v of this.defs.slice(1)){
                let r = v.parse(buf).get
                result.push(r)
            }
        }
        if(result.length==0){
            return none
        }else{
            some(new TreeEntrySequence({entries:result}))
        }
    }
}

function token(symbol: string, regexp: RegExp): Token{
    return new Token(symbol, regexp)
}

function exp(symbol: string,...children: Def[]): StdNode{
    return new StdNode(symbol, children)
}

function choice(...choice: Def[]): Choice{
    return new Choice(choice)
}

function repeat(...repeat: Def[]): Repeat{
    return new Repeat(repeat)
}

export let number = token('number', /[0-9]+/)
export let addsub_op = token('addsub_op', /[+\\-]/)
export let muldiv_op = token('muldiv_op', /[*/]/)
export let muldiv_exp = exp('muldiv_exp', number, repeat(muldiv_op, number))
export let addsub_exp = exp('addsub_exp', muldiv_exp, repeat(addsub_op, muldiv_exp))

export class InputBuffer{
    ws: RegExp = /[ ]+/
    inputString: string
    constructor(inputString: string){
        this.inputString = inputString
        this.skip_ws()
    }

    match(regexp: RegExp): boolean{
        let m = this.inputString.search(regexp)
        if(m == 0){
            return true
        }
        return false
    }

    next(regexp: RegExp): string{
        let m = this.inputString.match(regexp)
        for(let head of m.entries()){
            this.inputString = this.inputString.substr(new String(head[1]).length)
            this.skip_ws()
            return head[1]
        }
        throw new Error()
    }

    skip_ws(){
        if(this.match(this.ws)){
            this.next(this.ws)
        }
        
    }
}

export class Runner{
    run(root: TreeNode): number{
        return 1
    }

}

export function calc(inputString: string){
    let buf = new InputBuffer(inputString)
    let tree = addsub_exp.parse(buf)
}