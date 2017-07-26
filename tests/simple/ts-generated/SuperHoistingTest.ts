import { MyClass } from "./MyClass";

export class SuperHoistingTest extends MyClass
{
	constructor(){
		super();

	}

	/*override*/ protected myFunc = (value:number):number => 
	{
		return super.myFunc(value) * 3;
	}

	/*override*/ public get myProp()        :number {return super.myProp * 5}
	/*override*/ public set myProp(value    :number ) {super.myProp / 5}
}


class MyClass{
	protected myVar:number = 7;
	protected myVar2:number;

	public get myProp()        :number {return this._myProp }
	public set myProp(value    :number ) {this._myProp = value;}
	private _myProp                 :number = 5;


	constructor()
	{
		this.myVar2 = 13;
	}
	protected myFunc = (value:number):number => 
	{
		return value * 10;
	}
}
