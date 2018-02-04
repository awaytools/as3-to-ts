import { IDoer } from "./IDoer";
import { bound } from "../../../bound";
import { classBound } from "../../../classBound";
/**
 * Created by palebluedot on 3/24/17.
 */
@classBound
export class Thing implements IDoer {

    static __interfaces__ = ["IDoer"];
private aFunction:Function = (param1:number, param2:string):boolean =>  {
        return false;
    };

    constructor(){


    }

    @bound
    public doSomething():void {
        // this looks like a comment, but it isn't.
    }

    @bound
    private thisIsASuperSecretMethod(name:string, defaultVal:any = null):void {

    }

    @bound
    private addSubDoer(doer:IDoer):void {

    }
}

