import { classBound } from "undefinedclassBound";


@classBound
export class DebugClass {
    private prop1:number;
	private prop2:number;
	private prop3:number;
	constructor(){

        console.log(this.prop2);
    }


}

