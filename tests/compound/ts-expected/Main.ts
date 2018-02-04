import { bound } from "./bound";
import { AwayDate } from "@as3web/flash";
import { classBound } from "./classBound";

import { Sprite } from "@as3web/flash"
import { StageAlign } from "@as3web/flash"
import { StageScaleMode } from "@as3web/flash"
import { TextField } from "@as3web/flash"
import { navigateToURL } from "@as3web/flash"
import { URLRequest } from "@as3web/flash"

import {Vehicle} from "./vehicles/Vehicle";

@classBound
export class Main extends Sprite {

    @bound
    public doYourThing(spr:Sprite):void {
    console.log("snippets are cool");
}

    private thing1:string = "heya";
    private thing2:string = "oops, forgot the semi :O"
    public noAccessDeclDefaultsToInternal:string;

    constructor(){
        super();

        this.earlyDrop();

        // method doens't exist
        this.doSomething();

        this.stage.scaleMode = StageScaleMode.NO_SCALE;
        this.stage.align = StageAlign.TOP_LEFT;

        var msg:string = "Hello, World";

        navigateToURL(new URLRequest("https://www.away3d.com"), "_self");
        var textField:TextField = new TextField();
        textField.x = 100;
        textField.y = 100;
        textField.text = msg;
        this.addChild(textField);

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

        var a:string = "a";
        switch(a) {
            case "b":
                break;
            case "a":
                break;
        }

        for(var i:number = 0; i < 10; i++) {
            continue;
        }

        var date:AwayDate = new AwayDate();
    }

    @bound
    public earlyDrop(something:boolean):void {
        if(something == false) {
            return;
        }
        if(something == true) {
            return;
        }
        var a:string = "a";
    }
}

