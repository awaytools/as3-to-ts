export class SuperArray extends Array {

  constructor(...args){
    super(args);
var thisAny:any=this;
thisAny.__proto__ = SuperArray.prototype;


    var a:string = 'this should all be normal stuff';
    console.log(a);

    /*
    Expects TS to insert the following when a class extends array:
    var thisAny:any=this;
     thisAny.__proto__ = SuperArray.prototype;
    * */
  }
}

