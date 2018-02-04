import { AS3Utils } from "./AS3Utils";
import { classBound } from "./classBound";
@classBound
export class PrimitiveCheck {

  constructor(){

    var myVar;
    if(typeof myVar === 'number')     { console.log("it's a number"); }
    if(typeof myVar === 'string')  { console.log("it's a string"); }
    if(typeof myVar === 'boolean') { console.log("it's a boolean"); }
    if(myVar instanceof Object)  { console.log("it's an object"); }

    /*
    Expected TS:
     if(typeof myVar === "number") { console.log("it's a number"); }
     if(typeof myVar === 'string') { console.log("it's a string"); }
     if(typeof myVar === 'boolean')   { console.log("it's a boolean"); }
    */
  }
}

