export class AS3Utils {
    static isInstanceOfInterface(instance:any, interfaceName:string):boolean
    {
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
}
