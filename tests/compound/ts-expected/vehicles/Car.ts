import { Vehicle } from "./Vehicle";
import { classBound } from "../classBound";
/**
 * Created by palebluedot on 3/24/17.
 */
import { Wheel } from "./components/Wheel";

@classBound
export class Car extends Vehicle {

    public wheels:Wheel[];

    constructor(){
        super();

        this.wheels = [];
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
    }
}

