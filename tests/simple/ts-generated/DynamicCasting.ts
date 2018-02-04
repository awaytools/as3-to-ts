import { DebugClass } from "./DebugClass";
import { classBound } from "./classBound";

@classBound
export class DynamicCasting
{
	constructor(){
        return (<DebugClass>(new pRootClass()) );
	}
}


