/**
 * Binds an instance method to the containing class to persist the lexical scope of 'this'.
 * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 */
export function classBound(target: any) {

    // save a reference to the original constructor
    var original = target;

    // a utility function to generate instances of a class
    function construct(constructor:any, args:any) {
        var c : any = function () {
            var __boundMethods__ = this.__boundMethods__;
            var _this = this;
            for (var key in __boundMethods__) {
                this[key] = function (key) {
                    return function () {
                        return __boundMethods__[key].apply(_this, arguments);
                    }
                }(key);
            }
            return constructor.apply(this, args);
        }
        c.prototype = constructor.prototype;
        return new c();
    }

    var c : any = function () {
        var __boundMethods__ = this.__boundMethods__;
        var _this = this;
        for (var key in __boundMethods__) {
            this[key] = function (key) {
                return function () {
                    return __boundMethods__[key].apply(_this, arguments);
                }
            }(key);
        }
        return original.apply(this, arguments);
    }
    c.prototype = original.prototype;

    Object.defineProperty(c, "name", {value: original.name, writable: false});

    for (var p in original) if (original.hasOwnProperty(p)) c[p] = original[p];

    return c;

    // // the new constructor behaviour
    // var f : any = function () {
    //     return construct(original, arguments);
    // }
	//
    // // copy prototype so intanceof operator still works
    // f.prototype = original.prototype;
	//
    // //copy statics
    // for (var p in original) if (original.hasOwnProperty(p)) f[p] = original[p];
	//
    // // return new constructor (will override original)
    // return f;

    // return a new constructor that extends the original
    // return function (...args:any[]) {
    //     var c : any = function () {
    //         var instance = original.apply(this, args);
	//
    //         //add scope wrapper
    //         for (var key of instance.__boundMethods__)
    //             instance[key] = (...args:any[]) => instance.__boundMethods__[key](args);
	//
    //         return instance;
    //     }
    //     c.prototype = original.prototype;
	//
    //     return new c();
    // }
    // // the new constructor behaviour
    // var f : any = function (...args:any[]) {
    //     console.log("New: " + original.name);
    //     return construct(original, args);
    // }
	//
    // // copy prototype so intanceof operator still works
    // f.prototype = original.prototype;
	//
    // // return new constructor (will override original)
    // return class extends target {
    //     constructor(...args:any[]) {
    //         super(args);
	//
    //         //add scope wrapper
    //         for (var str of this["__boundMethods__"])
    //             this[str] = (...args:any[]) => this.__boundMethods__[str](args);
    //     }
    // };
}
