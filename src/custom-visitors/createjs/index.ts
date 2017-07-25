import Node, { createNode } from "../../syntax/node";
import NodeKind from "../../syntax/nodeKind";
import Emitter, {
    EmitterOptions,
    visitNode,
    visitNodes,
    emitIdent
} from "../../emit/emitter";

// import translations
let imports = new Map<RegExp, string>();
imports.set(/^flash.display.DisplayObjectContainer/, "createjs.Container");
imports.set(/^flash.[a-z]+\.([A-Za-z]+)/, "createjs.$1");

function visit (emitter: Emitter, node: Node): boolean {

    //
    // translate `MouseEvent.EVENT_NAME` to `"eventname"`
    //
    if (node.kind === NodeKind.DOT) {
        if (node.children[0].text === "MouseEvent") {
            emitter.catchup(node.start);
            emitter.insert("\"" + node.children[1].text.replace("_", "").toLowerCase() + "\"");
            emitter.skipTo(node.end);

            return true;
        }
    }

    return false;
}

function postProcessing (emitterOptions: EmitterOptions, contents: string): string {
    // fix createjs imports if using CommonJS
    if (!emitterOptions.useNamespaces) {
        contents = contents.replace(/import { ([a-zA-Z]+) } from ".*createjs\/([a-zA-Z]+)";/gm, "import $1 = createjs.$1;");
    }

    // Replace all 'var' to block-scoped 'let'
    contents = contents.replace(/\b(var)\b/gm, "let");


    // 1. Replace all listeners callbacks into arrow functions (to keep class scope)
    contents = contents.replace(
        /(public|private|protected)( static)?[\ ]+(\w+)([a-zA-Z\ ]+)?\(([^:]+.*Event.*)\).*(void)/g,
        "$1$2 $3 = ($5): void =>"
    );

    contents = contents.replace(/\s([^\n])\s*?=>/gm, " =>");

    // 2. Replace all `super.on{CallbackName}` calls.
    let overridesRegExp = /^(.*)\/\*override\*\/.*(public|private|protected)[^\w]+(\w+)[a-zA-Z\ =]+\([^:]+.*Event.*\)/gm;
    let callbackOverrides = contents.match(overridesRegExp);
    if (callbackOverrides && callbackOverrides.length > 0) {
        for (let i = 0, len = callbackOverrides.length; i < len; i++) {
            let matches = overridesRegExp.exec(callbackOverrides[i]);
            if (matches) {
                contents = contents.replace(matches.input, `${matches[1]}protected super_${matches[3]} = this.${matches[3]};\n${matches.input}`);
                // 3. Replace occurrences of super calls on callbacks
                contents = contents.replace(`super.${ matches[3] }`, `this.super_${ matches[3] }`);
            }
        }
    }

    return contents;
}

const typeMap: { [id: string]: string } = {
    'DisplayObjectContainer': 'Container',
    'Sprite': 'Container'
}

const identifierMap: { [id: string]: string } = {
    'DisplayObjectContainer': 'Container',
    'Sprite': 'Container'
}

export default {
    imports: imports,
    visit: visit,
    postProcessing: postProcessing,
    typeMap: typeMap,
    identifierMap: identifierMap,
}
