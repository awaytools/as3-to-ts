import { AS3Utils } from "as3-to-ts/src/AS3Utils";
import { ISimpleInterface } from "./ISimpleInterface";
import { ISimpleInterface2 } from "./ISimpleInterface2";
import { bound } from "as3-to-ts/src/bound";

export class DebugClass
{
    constructor(){
        var ins1:MyClass = new MyClass();
        var ins2:MyClass = new MySubClass();
        var ins3:MyClass = new MySubSubClass();
        var ins4:MySubClass = new MySubClass();
        var ins5:MySubClass = new MySubSubClass();
        var ins6:MySubSubClass = new MySubSubClass();

        var resultA1:boolean = AS3Utils.isInstanceOfInterface(ins1, "ISimpleInterface");
        var resultA2:boolean = AS3Utils.isInstanceOfInterface(ins2, "ISimpleInterface");
        var resultA3:boolean = AS3Utils.isInstanceOfInterface(ins3, "ISimpleInterface");
        var resultA4:boolean = AS3Utils.isInstanceOfInterface(ins4, "ISimpleInterface");
        var resultA5:boolean = AS3Utils.isInstanceOfInterface(ins5, "ISimpleInterface");
        var resultA6:boolean = AS3Utils.isInstanceOfInterface(ins6, "ISimpleInterface");
        var resultB1:boolean = AS3Utils.isInstanceOfInterface(ins1, "ISimpleInterface2");
        var resultB2:boolean = AS3Utils.isInstanceOfInterface(ins2, "ISimpleInterface2");
        var resultB3:boolean = AS3Utils.isInstanceOfInterface(ins3, "ISimpleInterface2");
        var resultB4:boolean = AS3Utils.isInstanceOfInterface(ins4, "ISimpleInterface2");
        var resultB5:boolean = AS3Utils.isInstanceOfInterface(ins5, "ISimpleInterface2");
        var resultB6:boolean = AS3Utils.isInstanceOfInterface(ins6, "ISimpleInterface2");


        var result:string = Number(resultA1) + "/" + Number(resultA2) + "/" +  Number(resultA3) + "/" +  Number(resultA3) + "/" +  Number(resultA4) + "/" +  Number(resultA5) + "/" +  Number(resultA6) + "/" +
            + Number(resultB1) + "/" + Number(resultB2) + "/" +  Number(resultB3) + "/" +  Number(resultB3) + "/" +  Number(resultB4) + "/" +  Number(resultB5) + "/" +  Number(resultB6);
        console.log(result == "1/1/1/1/1/1/1/0/0/1/1/0/1/1", "expected:" + "1/1/1/1/1/1/1/0/0/1/1/0/1/1", "result " + result);
    }
}


class MyClass implements ISimpleInterface, ISimpleInterface2{
    static __interfaces__ = ["ISimpleInterface", "ISimpleInterface2"];
@bound
public myFunction(var1:number = 7, var2:string = "13", var3:number = 17):number
    {
        return var1 + parseInt(var2) + var3
    }
}
class MySubClass extends MyClass{
    public static MY_STATIC_CONST:number = 29;
    public myVar:number = 7;
}

class MySubSubClass extends MySubClass  implements ISimpleInterface2{

}

const test = new DebugClass()