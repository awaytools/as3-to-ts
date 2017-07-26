package {


import flash.display.Sprite;
import flash.display.StageAlign;
import flash.display.StageScaleMode;
import flash.text.TextField;
import flash.net.navigateToURL;
import flash.net.URLRequest;

import vehicles.Vehicle;

public class Main extends Sprite {

    public function doYourThing(spr:Sprite):void {
    trace("snippets are cool");
}


    private var thing1:String = "heya";
    private var thing2:String = "oops, forgot the semi :O"
    public var noAccessDeclDefaultsToInternal:String;

    public function Main() {
        super();

        earlyDrop();

        // method doens't exist
        doSomething();

        stage.scaleMode = StageScaleMode.NO_SCALE;
        stage.align = StageAlign.TOP_LEFT;

        var msg:String = "Hello, World";

        navigateToURL(new URLRequest("https://www.away3d.com"), "_self");
        var textField:TextField = new TextField();
        textField.x = 100;
        textField.y = 100;
        textField.text = msg;
        addChild(textField);

        var vehicle:Vehicle= new Vehicle;
        vehicle.doSomething();

        // Comment.

        /*
        This
        is
        a
        multiline
        comment.
         */

        var a:String = "a";
        switch(a) {
            case "b":
                break;
            case "a":
                break;
        }

        for(var i:uint = 0; i < 10; i++) {
            continue;
        }

        var date:Date = new Date();
    }

    public function earlyDrop(something:Boolean):void {
        if(something == false) {
            return;
        }
        if(something == true) {
            return;
        }
        var a:String = "a";
    }
}
}
