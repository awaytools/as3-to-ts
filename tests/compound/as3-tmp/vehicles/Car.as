/**
 * Created by palebluedot on 3/24/17.
 */
package vehicles {
import vehicles.components.Wheel;

public class Car extends Vehicle {

    public var wheels:Vector.<Wheel>;

    public function Car() {
        super();

        wheels = new Vector.<Wheel>();
        wheels.push( new Wheel() );
        wheels.push( new Wheel() );
        wheels.push( new Wheel() );
        wheels.push( new Wheel() );
    }
}
}
