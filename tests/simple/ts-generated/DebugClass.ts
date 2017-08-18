import { MyClass } from "./MyClass";
import { MyInterface } from "./MyInterface";
import { DisplayObject } from "./DisplayObject";
import { classBound } from "undefinedclassBound";


@classBound
export class DebugClass extends MyClass implements MyInterface
{

    static __interfaces__ = ["MyInterface"];
constructor(){
		super();
        this.addChild(new (<DisplayObject>tMainClass() ));
    }


}


