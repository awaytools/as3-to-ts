import { bound } from "./bound";
import { classBound } from "./classBound";
@classBound
export class Casting {

    constructor(){

        var v0:string = "HEY";
        this.thisMethodIsInTheClassScope(v0.toLowerCase());

        var v1:any[] = [1, 2, 3];
        var v2:string = String(v1[2]);
        var v3:string = String(v1[2].toUpperCase());

        this.thisMethodIsInTheClassScope("hey");

        var nowThisIsTricky:number = Number(v1[3]);

        var v4:number = Math.round(Number("5"));
        var v4:number = Math.round(5.2);

        var v5:number[] = <number[]>([1, 2, 3, 4]);

        console.log("lets cast");

        var str:string = "5";
        var num:number = 1;
        console.log("str: " + str + ", num: " + num);

        // String -> Num
        num = Number(str) + 1;
        console.log("str: " + str + ", num: " + num);

        // Num -> String
        str = String(num + 1);
        console.log("str: " + str + ", num: " + num);

    }

    @bound
    private thisMethodIsInTheClassScope(str:string) {
        console.log(str);
    }
}

new Casting();