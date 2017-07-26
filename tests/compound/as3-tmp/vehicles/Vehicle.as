/**
 * Created by palebluedot on 3/24/17.
 */
package vehicles {
import vehicles.components.Base.Thing;
import vehicles.components.Engine;

public class Vehicle extends Thing {

    public var engine:Engine;

    public function Vehicle() {
        super();
        doSomething();
        doSomethingElse(); // method doesn't exist
    }
}
}
