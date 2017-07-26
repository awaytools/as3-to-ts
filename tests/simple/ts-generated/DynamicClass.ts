import { SubDynamicClass } from "./SubDynamicClass";


export class DynamicClass
{
	constructor(){
		var myClass:SubDynamicClass = new SubDynamicClass();
		myClass.a = 10;
		console.log(myClass);
	}
}


export class SubDynamicClass{

}