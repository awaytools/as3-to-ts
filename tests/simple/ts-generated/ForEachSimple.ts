
export class ForEachSimple
{
    constructor(){
        var myObj:any = {a:2, b:3, c:40};
        for  (var __$nflvKey  in myObj)
        {
			this.value = myObj[__$nflvKey];

            console.log(this.value);
        }
    }

}
