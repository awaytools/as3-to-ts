import { bound } from "./bound";
import { classBound } from "./classBound";
@classBound
export class Callbacks {

    public a:string = "a"

    constructor(){

        this.callback(); // in ts: (class callback) this is: [object Object], a is: a
        this.executeCallback(this.callback); // in ts: (class callback) this is: undefined, a is: unknown
        this.executeCallback(() => { // in ts: (class callback) this is: undefined, a is: unknown
            console.log("(anonymous callback) this is: " + this);
            if(this) { console.log("a is: " + this.a) }
            else { console.log("a is: unknown") }
        });
    }

    @bound
    private callback():void {
        console.log("(class callback) this is: " + this);
        if(this) { console.log("a is: " + this.a) }
        else { console.log("a is: unknown") }
    }

    @bound
    private executeCallback(callback:Function):void {
        callback();
    }
}

new Callbacks();