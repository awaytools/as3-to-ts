/**
 * Created by palebluedot on 3/24/17.
 */
package vehicles.components {
import flash.utils.getTimer;

import vehicles.components.Base.Thing;

public class Engine extends Thing {

    private var _timeStarted:Number = -1;

    public function Engine() {
        super();
    }

    public function start():void {
        _timeStarted = getTimer();
    }

    public function stop():void {
        _timeStarted = -1;
    }

    public function getRunningTime():Number {
        if(_timeStarted == -1) {
            return 0;
        }
        else {
            return getTimer() - _timeStarted;
        }
    }
}
}
