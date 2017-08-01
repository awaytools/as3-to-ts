"use strict";
var Library_1 = require("./Library");
var AS3Utils = (function () {
    function AS3Utils() {
    }
    AS3Utils.isInstanceOfInterface = function (instance, interfaceName) {
        var superRef = instance;
        while (superRef = superRef['__proto__']) {
            if (superRef.constructor) {
                var interfacesArr = superRef.constructor['__interfaces__'];
                if (interfacesArr) {
                    if (interfacesArr.indexOf(interfaceName) >= 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    AS3Utils.getDefinitionByName = function (classPath) {
        var classlist = Library_1.default.classList;
        var key = classPath;
        if (classlist[key]) {
            return classlist[key];
        }
        else {
            console.log("AS3Utils : ***Warning*** Invalid class reference");
            return null;
        }
    };
    return AS3Utils;
}());
exports.AS3Utils = AS3Utils;
