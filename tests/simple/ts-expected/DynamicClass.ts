import { SubDynamicClass } from "./SubDynamicClass";
import { classBound } from "./classBound";

	@classBound
	export class DynamicClass
	{
		constructor(){
			var myClass:SubDynamicClass = new SubDynamicClass();
			myClass.a = 10;
			console.log(myClass);
		}
	}

	@classBound
	export class SubDynamicClass{

	}
