import { bound } from "as3-to-ts/src/bound";
/**
 * Created by palebluedot on 5/3/17.
 */
export class Unreachable {
    constructor(){
        this.demonstrate();
    }
    @bound
public demonstrate():number {

        var tPow:number = 1;
        var tExp:number = 1;
        var tNum:number = 1;
        var tAverage:number = 1;
        var tFactorial:number = 1;
        var tRandom:number = 1;

        // more stuff in function here
        while (true)
        {
            var tP:number = tPow * tExp / tFactorial;
            if (tRandom < tP)
            {
                return tNum
            }
            tRandom -= tP;
            tNum++;
            tFactorial *= tNum;
            tPow *= tAverage
        }
//        return 0 // just for the compiler
    }
}

