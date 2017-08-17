import { MyClass } from "./MyClass";
import { MyInterface } from "./MyInterface";
import { classBound } from "./classBound";


@classBound
export class DebugClass extends MyClass implements MyInterface
{

    static __interfaces__ = ["MyInterface"];
constructor(){
		super();
        MyClass.myVar;
    }


}



