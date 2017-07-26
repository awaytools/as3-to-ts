import { SubDynamicClass } from "./SubDynamicClass";

	export class DynamicClass
	{
		static __interfaces__;
constructor(){
			var myClass:SubDynamicClass = new SubDynamicClass();
			myClass.a = 10;
			console.log(myClass);
		}
	}

	export class SubDynamicClass{

	}
