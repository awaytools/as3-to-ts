import Library from "./Library";
interface KeyValue {
    key   : any;
    value : any;
}

export class AS3Utils {
    static isInstanceOfInterface(instance:any, interfaceName:string):boolean
    {
        if (!instance)
            return false;

        var superRef = instance;
        while (superRef = superRef['__proto__'])
        {
            if (superRef.constructor)
            {
                var interfacesArr:Array<string> =  superRef.constructor['__interfaces__'];
                if (interfacesArr)
                {
                    if (interfacesArr.indexOf(interfaceName) >= 0)
                    {
                        return true;
                    }
                }
            }

        }
        return false;
    }
    static getDefinitionByName(classPath:string):any
    {
        let classlist = Library.classList;
        var key:any = classPath;
        if (classlist[key]) {
            return classlist[key]
        } else
        {
            console.log("AS3Utils : ***Warning*** Invalid class reference");
            return null
        }

    }
    static sortRETURNINDEXEDARRAY(array:any):any
    {


        let helper: Array<KeyValue> = [];
        for (var i = 0; i < array.length; i++) {
            var item = array[i];
            let keyValue: KeyValue = {key: i, value: item};
            helper.push(keyValue);
        }
        helper.sort((a: KeyValue, b: KeyValue) => {
            return(a.value < b.value) ? -1 : (a.value > b.value) ? 1 : 0;
        });
        helper
        let result: Array<number> = []
        for (var i = 0; i < helper.length; i++) result.push(helper[i].key);
        return result

    }
}
