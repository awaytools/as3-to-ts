import { MappedClass } from "./MappedClass";

export class ForEachClassMapping
{
	constructor(){
		var myObj:any = {};
		var a:MappedClass = new MappedClass("a");
		myObj.a = a;
		var b:MappedClass = new MappedClass("b");
		myObj.b = b;
		var c:MappedClass = new MappedClass("c");
		myObj.c = c;
		for  (var __$nflvKey  in myObj)
		{
			var value:MappedClass = myObj[__$nflvKey];

			console.log(value);
		}
	}
}



class MappedClass
{
	public value:string;
	constructor(value)
	{
		this.value = value;
	}

	public toString = ():string => 
	{
		return this.value;
	}
}
