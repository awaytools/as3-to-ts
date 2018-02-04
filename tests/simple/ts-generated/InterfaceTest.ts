import { classBound } from "./classBound";
import { bound } from "./bound";

@classBound
export class InterfaceTest
{
	constructor(){
		var myClass:MyClass = new MyClass();
		console.log(myClass.myFunc(1));
	}
}


interface myInterface{
	myFunc(value:Number):number
}

class MyClass implements myInterface{
	static __interfaces__ = ["myInterface"];
@bound
public myFunc(value:number):number
	{
		return 10
	}
}