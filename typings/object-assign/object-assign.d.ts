// Type definitions for object-assign 4.0.1
// Project: https://github.com/sindresorhus/object-assign
// Definitions by: Christopher Brown <https://github.com/chbrown>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module "object-assign" {
  function objectAssign<T, U>(target: T, u: U): T & U;
  function objectAssign<T, U, V>(target: T, u: U, v: V): T & U & V;
  function objectAssign<T, U, V, W>(target: T, u: U, v: V, w: W): T & U & V & W;
  function objectAssign<T, U>(target: T, ...sources: U[]): T & U;
  export = objectAssign;
}
