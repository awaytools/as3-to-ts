/**
 * Created by 80prozent on 3/31/2017.
 */

/**
 * Fix import statements
 */

import Node, { createNode } from "../../syntax/node";
import Emitter, { EmitterOptions } from "../../emit/emitter";

function visit (emitter: Emitter, node: Node): boolean {
    return false;
}

function postProcessing (emitterOptions: EmitterOptions, contents: string): string {

    //fix import statements for flash package:
    contents = contents.replace(/import {([ 0-9a-zA-Z]+)} from "[.\/]+flash[^"]+";?/gm, "import {$1} from \"@as3web/flash\"");

    //fix import statements for away3d package:
    contents = contents.replace(/import {([ 0-9a-zA-Z]+)} from "[.\/]+away3d[^"]+";?/gm, "import {$1} from \"@as3web/away3d\"");

    //fix import statements for starling package:
    contents = contents.replace(/import {([ 0-9a-zA-Z]+)} from "[.\/]+starling[^"]+";?/gm, "import {$1} from \"@as3web/flash\"//starling");

    //fix import statements for com.greensock package:
    contents = contents.replace(/import {([ 0-9a-zA-Z]+)} from "[.\/]+com\/greensock[^"]+";?/gm, "import {$1} from \"gsap\"//com.greensock");

    // hack-fix to correct import for XMLDocumentAway
    contents = contents.replace('import { XMLDocumentAway } from "./XMLDocumentAway";','import { XMLDocumentAway } from "@as3web/flash";');
    //return here if you want to prevent import cleanup
    //return contents;

    //contents = contents.replace(/\r\n?/g, '\n');
    // find all imports:
    return contents;
/*    let allImports=contents.match(/import {([ 0-9a-zA-Z]+)} from "[.\/@0-9a-zA-Z]+";?/gm);
    if(allImports){
        allImports.forEach(function(oneImport){
            // find the classname only
            let importname=oneImport.replace(/import {([ 0-9a-zA-Z]+)} from "[.\/@0-9a-zA-Z]+";?/gm, "$1");


            // remove the import statement in a tmp string
            let contents_tmp = contents.replace(oneImport, "");

            //console.log(importname);

            // check if the import is still in the content
            // (that means the import was there 2 times, and we can just forget about this one)
            if(contents_tmp.match(oneImport)!=null){
                //console.log("       import statement is found in file more than once.");
                contents = contents_tmp;
            }
            else{
                // check if the Classname is ever used inside the content.
                let regexName=new RegExp("[^0-9a-zA-Z]+"+importname.replace(/\s+/g, '')+"+[^0-9a-zA-Z]", "gm");
                //console.log(contents.match(regexName));
                if(contents_tmp.match(regexName)==null || contents_tmp.match(regexName).length==0){
                    //console.log("       import statement is not used in file.");
                    contents = contents_tmp;
                }
            }
            //console.log(contents.match(regexName).length, importname);
        });
    }

    return contents;*/
}
export default {
    visit: visit,
    postProcessing: postProcessing
}
