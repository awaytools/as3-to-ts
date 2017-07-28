import { bound } from "as3-to-ts/src/bound";

export class Being {
    public name:string;
    private _happiness:string;
    public set happiness(value:string) {
        this.doSetHappiness(value);
    }
    @bound
public doSetHappiness(value:string):void {
        this._happiness = value;
    }
    constructor(){
        this.name = "abstract being";
        this.happiness = "low";
    }
    @bound
public be():void {
        console.log(this.name + " is - hapiness: " + this._happiness);
    }
}

export class Animal extends Being {
    constructor(){
        super();
        this.name = "animal";
    }
    @bound
public move():void {
        console.log(this.name + ", an animal, moved");
        this.breathe();
    }
    @bound
protected breathe():void {
        console.log(this.name + ", an animal, breathed");
        this.be();
    }
}

export class Snake extends Animal {
    constructor(){
        super();
        this.name = "snake";
    }
    /*override*/ public set happiness(value:string) {
        this.doSetHappiness("very " + value);
        this.breathe();
    }
    @bound
/*override*/ public move():void {
        this.happiness = "high";
        super.move();
    }
}

var sam:Snake = new Snake();
sam.move();


