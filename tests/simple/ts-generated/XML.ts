import { XML, XMLList } from "@as3web/flash";
export class XML {

  constructor(){

    var sport:XML =
      "<sport>\n        <name isCool='yes'>Basketball</name>\n        <players>men</players>\n        <players>women</players>\n        <nationalTV>NBC</nationalTV>\n        <nationalTV>ESPN</nationalTV>\n      </sport>";

    sport.name["isCool"] = '→';

    var some_numbers:number[] = [];
    some_numbers.push(0);
    console.log('sport name isCool: ' + sport.name.attributes[some_numbers[0]]);
    console.log('sport name isCool: ' + sport.name.attributes['isCool']);
    console.log('sport name isCool: ' + sport.name.attribute("isCool"));
  }
}

