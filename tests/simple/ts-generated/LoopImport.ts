import { SubClass } from "./SubClass";

export class LoopImport
{
	constructor(){
		var array:any[] = [1,2,3,4];
		for (var i:number = 0; i < array.length; i++)
		{
			console.log(array[i]);
			var subClass:SubClass = new SubClass();
		}
	}
}

class SubClass{
	constructor()
	{

	}
}
