/**
 * Created by palebluedot on 3/24/17.
 */
import { Thing } from "./components/Base/Thing";
import { Engine } from "./components/Engine";

export class Vehicle extends Thing {

    public engine:Engine;

    constructor(){
		super();
        super();
        this.doSomething();
        this.doSomethingElse(); // method doesn't exist
    }
}

