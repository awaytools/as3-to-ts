import { AS3Utils } from "as3-to-ts/src/AS3Utils";

export class DebugClass
{
    public key;
	constructor(){
		var ref:string = "rs.Rs";
        var tClass:any = (<any>AS3Utils.getDefinitionByName(ref) );
	}


}


