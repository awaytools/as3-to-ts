import { Vehicle } from "./Vehicle";
/**
 * Created by palebluedot on 3/24/17.
 */
import { Wheel } from "./components/Wheel";

export class Car extends Vehicle {

    public wheels:Wheel[];

    constructor(){
		super();
        super();

        this.wheels = [];
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
        this.wheels.push( new Wheel() );
    }
}

