export class Being {
    public name:string;
    private _happiness:string;
    public set happiness(value:string) {
        this.doSetHappiness(value);
    }
    public doSetHappiness = (value:string):void =>  {
        this._happiness = value;
    }
    constructor(){
        this.name = "abstract being";
        this.happiness = "low";
    }
    public be = ():void =>  {
        console.log(this.name + " is - hapiness: " + this._happiness);
    }
}

export class Animal extends Being {
    constructor(){
		super();
        super();
        this.name = "animal";
    }
    public move = ():void =>  {
        console.log(this.name + ", an animal, moved");
        this.breathe();
    }
    protected breathe = ():void =>  {
        console.log(this.name + ", an animal, breathed");
        this.be();
    }
}

export class Snake extends Animal {
    constructor(){
		super();
        super();
        this.name = "snake";
    }
    /*override*/ public set happiness(value:string) {
        this.doSetHappiness("very " + value);
        this.breathe();
    }
    /*override*/ public move = ():void =>  {
        this.happiness = "high";
        super.move();
    }
}

var sam:Snake = new Snake();
sam.move();


