import { AS3Utils } from "as3-to-ts/src/AS3Utils";

export class DebugClass
{
    public key;
	constructor(){
        for (var i:number = 0; i < this.tArray.length; i++) {
            this.tTrans.push(this.fGetText(this.tArray[i]));
            this.tTemp.push(this.tArray[i])
        }
        var tSort:any[] = AS3Utils.sortRETURNINDEXEDARRAY(tTrans);
	}


}


