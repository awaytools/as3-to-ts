import { XML, XMLList } from "@as3web/flash";
import { classBound } from "./classBound";
@classBound
export class XML {

  constructor(){

    var sport:XML =
      "<sport>\r\n        <name isCool='yes'>Basketball</name>\r\n        <players>men</players>\r\n        <players>women</players>\r\n        <nationalTV>NBC</nationalTV>\r\n        <nationalTV>ESPN</nationalTV>\r\n      </sport>";

    sport.name["isCool"] = '→';

    var some_numbers:number[] = [];
    some_numbers.push(0);
    console.log('sport name isCool: ' + sport.name.attributes[some_numbers[0]]);
    console.log('sport name isCool: ' + sport.name.attributes['isCool']);
    console.log('sport name isCool: ' + sport.name.attribute("isCool"));
  }
}

