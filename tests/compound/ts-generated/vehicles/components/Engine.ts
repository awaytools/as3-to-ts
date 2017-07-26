/**
 * Created by palebluedot on 3/24/17.
 */


import { Thing } from "./Base/Thing";

export class Engine extends Thing {

    private _timeStarted:number = -1;

    constructor(){
		super();
        super();
    }

    public start = ():void =>  {
        this._timeStarted = Date.now();
    }

    public stop = ():void =>  {
        this._timeStarted = -1;
    }

    public getRunningTime = ():number =>  {
        if(this._timeStarted == -1) {
            return 0;
        }
        else {
            return Date.now() - this._timeStarted;
        }
    }
}

