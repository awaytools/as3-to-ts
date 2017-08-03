import Library from "./Library";
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
}
