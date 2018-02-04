import { classBound } from "../classBound";
/**
 * Created by palebluedot on 3/24/17.
 */
import { Thing } from "./components/Base/Thing";
import { Engine } from "./components/Engine";

@classBound
export class Vehicle extends Thing {

    public engine:Engine;

    constructor(){
        super();
        this.doSomething();
        this.doSomethingElse(); // method doesn't exist
    }
}

