import { classBound } from "./classBound";
  @classBound
  export class GetSet {

    constructor(){

    }

    public get thing():string[] {
      return <string[]>(['a thing']);
    }
  }

