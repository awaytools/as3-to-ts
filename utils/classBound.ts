/**
 * Binds an instance method to the containing class to persist the lexical scope of 'this'.
 * @param target The target class or prototype; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 * @param propKey The property key of the target method; used by the TypeScript compiler (omit function call brackets to use as a decorator).
 */
export function classBound(target: any) {

    // save a reference to the original constructor
    var original = target;

    var c : any = function () {
        var __boundMethods__ = original.prototype.__boundMethods__;
        var _this = this;
        for (var key in __boundMethods__) {
            if (!this.hasOwnProperty(key)) {
                this[key] = function (key:any) {
                    return function () {
                        return __boundMethods__[key].apply(_this, arguments);
                    }
                }(key);
            }
        }
        return original.apply(this, arguments);
    }

    var f : any = new Function("c", "return function " + original.name + "(){return c.apply(this, arguments);}")(c);

    f.prototype = original.prototype;

    for (var p in original) if (original.hasOwnProperty(p)) f[p] = original[p];

    return f;
}
