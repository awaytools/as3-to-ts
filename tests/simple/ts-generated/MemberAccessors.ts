export class Accessors {

    static __interfaces__;
public memberVar:string = "hello";

    constructor(){
        this.memberMethod();
    }

    public memberMethod = ():void =>  {
        console.log(this.memberVar);

        var a:string = "a";
        var b:string = "b";

        var c:Function = () => {
            console.log("hello! I am here to make your life more complicated =D");
        }
    }
}

