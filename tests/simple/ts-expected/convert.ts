import { Sprite } from "./Sprite";
import { View3D } from "./View3D";
import { Mesh } from "./Mesh";
import { StageScaleMode } from "./StageScaleMode";
import { StageAlign } from "./StageAlign";
import { PlaneGeometry } from "./PlaneGeometry";
import { TextureMaterial } from "./TextureMaterial";
import { Cast } from "./Cast";
import { Event } from "./Event";
/*

 Basic View example in Away3d

 Demonstrates:

 How to create a 3D environment for your objects
 How to add a new textured object to your world
 How to rotate an object in your world

 Code by Rob Bateman
 rob@infiniteturtles.co.uk
 http://www.infiniteturtles.co.uk

 This code is distributed under the MIT License

 Copyright (c) The Away Foundation http://www.theawayfoundation.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the “Software”), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 */


/*import away3d.containers.*;
*/
/*import away3d.entities.*;
*/
/*import away3d.materials.*;
*/
/*import away3d.primitives.*;
*/
/*import away3d.utils.*;
*/

/*import flash.display.*;
*/
/*import flash.events.*;
*/
import { Vector3D } from "@as3web/flash"

/*[SWF(backgroundColor="#000000", frameRate="60", quality="LOW")]*/

export class Basic_View extends Sprite
{
    //plane texture
    /*[Embed(source="/../embeds/floor_diffuse.jpg")]*/
    public static FloorDiffuse:any;

    //engine variables
    private _view:View3D;

    //scene objects
    private _plane:Mesh;

    /**
     * Constructor
     */
    constructor(){
        this.stage.scaleMode = StageScaleMode.NO_SCALE;
        this.stage.align = StageAlign.TOP_LEFT;

        //setup the view
        this._view = new View3D();
        this.addChild(this._view);

        //setup the camera
        this._view.camera.z = -600;
        this._view.camera.y = 500;
        this._view.camera.lookAt(new Vector3D());

        //setup the scene
        this._plane = new Mesh(new PlaneGeometry(700, 700), new TextureMaterial(Cast.bitmapTexture(Basic_View.FloorDiffuse)));
        this._view.scene.addChild(this._plane);

        //setup the render loop
        this.addEventListener(Event.ENTER_FRAME, this._onEnterFrame);
        this.stage.addEventListener(Event.RESIZE, this.onResize);
        this.onResize();
    }

    /**
     * render loop
     */
    private _onEnterFrame(e:Event):void
    {
        this._plane.rotationY += 1;

        this._view.render();
    }

    /**
     * stage listener for resize events
     */
    private onResize(event:Event = null):void
    {
        this._view.width = this.stage.stageWidth;
        this._view.height = this.stage.stageHeight;
    }
}

