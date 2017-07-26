/**
 * Created by palebluedot on 3/24/17.
 */
package vehicles.components.Base {
public class Thing implements IDoer {

    private var aFunction:Function = function(param1:uint, param2:String):Boolean {
        return false;
    };

    public function Thing() {


    }

    public function doSomething():void {
        // this looks like a comment, but it isn't.
    }

    private function thisIsASuperSecretMethod(name:String, defaultVal:* = null):void {

    }

    private function addSubDoer(doer:IDoer):void {

    }
}
}
