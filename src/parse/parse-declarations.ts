import Node, {createNode} from '../syntax/node';
import NodeKind from '../syntax/nodeKind';
import Token from './token';
import * as Keywords from '../syntax/keywords';
import * as Operators from '../syntax/operators';
import {startsWith} from '../string';
import AS3Parser, {nextToken, nextTokenIgnoringDocumentation, consume, skip, tokIs} from './parser';
import {parseQualifiedName, parseBlock, parseParameterList, parseNameTypeInit} from './parse-common';
import {ASDOC_COMMENT, MULTIPLE_LINES_COMMENT} from './parser';
import {VERBOSE_MASK} from '../config';
import {parseExpression} from './parse-expressions';
import {parseOptionalType} from './parse-types';
import {ReportFlags} from '../reports/report-flags';

/**
 * tok is empty, since nextToken has not been called before
 */
export function parseCompilationUnit(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.COMPILATION_UNIT);

    nextTokenIgnoringDocumentation(parser);
    if (tokIs(parser, Keywords.PACKAGE)) {
        result.children.push(parsePackage(parser));
    }
    result.children.push(parsePackageContent(parser));
    return result;
}


function parsePackage(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.PACKAGE);
    let result:Node = createNode(NodeKind.PACKAGE, {start: tok.index});
    let nameBuffer = '';

    let index = parser.tok.index;
    while (!tokIs(parser, Operators.LEFT_CURLY_BRACKET)) {
        nameBuffer += parser.tok.text;
        nextToken(parser);
    }
    result.children.push(createNode(NodeKind.NAME, {start: index, text: nameBuffer}));
    consume(parser, Operators.LEFT_CURLY_BRACKET);
    result.children.push(parsePackageContent(parser));
    tok = consume(parser, Operators.RIGHT_CURLY_BRACKET);
    result.end = tok.end;
    return result;
}


function parsePackageContent(parser:AS3Parser):Node {

    //if(VERBOSE >= 1) {
    if((VERBOSE_MASK & ReportFlags.PARSER_POINTS) == ReportFlags.PARSER_POINTS) {
        console.log("parse-declarations.ts - parsePackageContent() - token: " + parser.tok.text + ", line: " + parser.scn.lastLineScanned);
    }

    let result:Node = createNode(NodeKind.CONTENT, {start: parser.tok.index});
    let modifiers:Token[] = [];
    let meta:Node[] = [];

    while (!tokIs(parser, Operators.RIGHT_CURLY_BRACKET) && !tokIs(parser, Keywords.EOF)) {
        if (tokIs(parser, Keywords.IMPORT)) {
            result.children.push(parseImport(parser));
        } else if (tokIs(parser, Keywords.USE)) {
            result.children.push(parseUse(parser));
        } else if (tokIs(parser, Keywords.INCLUDE) || tokIs(parser, Keywords.INCLUDE_AS2)) {
            result.children.push(parseIncludeExpression(parser));
        } else if (tokIs(parser, Operators.LEFT_SQUARE_BRACKET)) {
            meta.push(parseMetaData(parser));
        } else if (tokIs(parser, Keywords.CLASS)) {
            result.children.push(parseClass(parser, meta, modifiers));
            modifiers.length = 0;
            meta.length = 0;
        } else if (tokIs(parser, Keywords.INTERFACE)) {
            result.children.push(parseInterface(parser, meta, modifiers));
            modifiers.length = 0;
            meta.length = 0;
        } else if (tokIs(parser, Keywords.FUNCTION)) {
            parseClassFunctions(parser, result, modifiers, meta);
        } else if (startsWith(parser.tok.text, ASDOC_COMMENT)) {
            parser.currentAsDoc = createNode(NodeKind.AS_DOC, {
                start: parser.tok.index,
                end: parser.tok.index + parser.tok.index - 1,
                text: parser.tok.text
            });
            nextToken(parser);
        } else if (startsWith(parser.tok.text, MULTIPLE_LINES_COMMENT)) {
            parser.currentMultiLineComment = createNode(NodeKind.MULTI_LINE_COMMENT, {
                start: parser.tok.index,
                end: parser.tok.index + parser.tok.index - 1,
                text: parser.tok.text
            });
            nextToken(parser);
        } else {
            modifiers.push(parser.tok);
            nextTokenIgnoringDocumentation(parser);
        }
    }
    if (result.lastChild) {
        result.end = result.lastChild.end;
    }
    return result;
}


function parseImport(parser:AS3Parser):Node {

    let tok = consume(parser, Keywords.IMPORT);
    let name = parseImportName(parser);
    let result:Node = createNode(NodeKind.IMPORT, {start: tok.index, text: name});
    skip(parser, Operators.SEMICOLON);
    //if(VERBOSE >= 2) {
    if((VERBOSE_MASK & ReportFlags.PARSER_IMPORTS) == ReportFlags.PARSER_IMPORTS) {
        console.log("parse-declarations.ts - parseImport() - name: " + name + ", line: " + parser.scn.lastLineScanned);
    }
    return result;
}


/**
 * tok is the first part of a name the last part can be a star exit tok is
 * the first token, which doesn't belong to the name
 */
function parseImportName(parser:AS3Parser):string {
    let result = '';

    result += parser.tok.text;
    nextToken(parser);
    while (tokIs(parser, Operators.DOT)) {
        result += Operators.DOT;
        nextToken(parser); // .
        result += parser.tok.text;
        nextToken(parser); // part of name
    }
    return result;
}


function parseUse(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.USE);
    consume(parser, Keywords.NAMESPACE);
    let nameIndex = parser.tok.index;
    let namespace = parseNamespaceName(parser);
    let result:Node = createNode(NodeKind.USE, {
        start: tok.index,
        end: nameIndex + namespace.length,
        text: namespace
    });
    skip(parser, Operators.SEMICOLON);
    return result;
}


function parseNamespaceName(parser:AS3Parser):string {
    let name:string = parser.tok.text;
    nextToken(parser); // simple name for now
    return name;
}


function parseIncludeExpression(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.INCLUDE, {start: parser.tok.index});
    let tok:Token;
    if (tokIs(parser, Keywords.INCLUDE)) {
        tok = consume(parser, Keywords.INCLUDE);
    } else if (tokIs(parser, Keywords.INCLUDE_AS2)) {
        tok = consume(parser, Keywords.INCLUDE_AS2);
    }
    if (tok) {
        result.start = tok.index;
    }
    result.children.push(parseExpression(parser));
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, 0);
    return result;
}


function parseMetaData(parser:AS3Parser):Node {
    let buffer = '';

    let index = consume(parser, Operators.LEFT_SQUARE_BRACKET).index;
    while (!tokIs(parser, Operators.RIGHT_SQUARE_BRACKET)) {
        buffer += parser.tok.text;
        nextToken(parser);
    }
    let end = parser.tok.end;
    skip(parser, Operators.RIGHT_SQUARE_BRACKET);
    return createNode(NodeKind.META, {start: index, end: end, text: '[' + buffer + ']'});
}


function parseClass(parser:AS3Parser, meta:Node[], modifier:Token[]):Node {
    let tok = consume(parser, Keywords.CLASS);
    let result:Node = createNode(NodeKind.CLASS, {start: tok.index, end: tok.end});

    if (parser.currentAsDoc) {
        result.children.push(parser.currentAsDoc);
        parser.currentAsDoc = null;
    }
    if (parser.currentMultiLineComment) {
        result.children.push(parser.currentMultiLineComment);
        parser.currentMultiLineComment = null;
    }

    let index = parser.tok.index,
        name = parseQualifiedName(parser, true);
    result.children.push(createNode(NodeKind.NAME, {start: index, text: name}));

    result.children.push(convertMeta(parser, meta));
    result.children.push(convertModifiers(parser, modifier));

    // nextToken(parser,  true ); // name

    do {
        if (tokIs(parser, Keywords.EXTENDS)) {
            nextToken(parser, true); // extends
            index = parser.tok.index;
            name = parseQualifiedName(parser, false);
            result.children.push(createNode(NodeKind.EXTENDS, {start: index, text: name}));
        } else if (tokIs(parser, Keywords.IMPLEMENTS)) {
            result.children.push(parseImplementsList(parser));
        }
    }
    while (!tokIs(parser, Operators.LEFT_CURLY_BRACKET));
    consume(parser, Operators.LEFT_CURLY_BRACKET);
    result.children.push(parseClassContent(parser));
    tok = consume(parser, Operators.RIGHT_CURLY_BRACKET);

    result.end = tok.end;
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, index);

    return result;
}


function parseImplementsList(parser:AS3Parser):Node {
    consume(parser, Keywords.IMPLEMENTS);
    let result:Node = createNode(NodeKind.IMPLEMENTS_LIST, {start: parser.tok.index});
    let index = parser.tok.index;
    let name = parseQualifiedName(parser, true);
    result.children.push(createNode(NodeKind.IMPLEMENTS, {start: index, text: name}));
    while (tokIs(parser, Operators.COMMA)) {
        nextToken(parser, true);
        let index = parser.tok.index;
        let name = parseQualifiedName(parser, true);
        result.children.push(createNode(NodeKind.IMPLEMENTS, {start: index, text: name}));
    }
    return result;
}


function parseClassContent(parser:AS3Parser):Node {

    //if(VERBOSE >= 1) {
    if((VERBOSE_MASK & ReportFlags.PARSER_CONTENT) == ReportFlags.PARSER_CONTENT) {
        console.log("parse-declarations.ts - parseClassContent() - token: " + parser.tok.text + ", line: " + parser.scn.lastLineScanned);
    }

    let result:Node = createNode(NodeKind.CONTENT, {start: parser.tok.index});
    let modifiers:Token[] = [];
    let meta:Node[] = [];

    while (!tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
        //if(VERBOSE >= 2) {
        if((VERBOSE_MASK & ReportFlags.PARSER_CONTENT) == ReportFlags.PARSER_CONTENT) {
            console.log("parse-declarations.ts - keyword: " + parser.tok.text + ", index: " + parser.tok.index);
        }
        if (tokIs(parser, Operators.LEFT_CURLY_BRACKET)) {
            result.children.push(parseBlock(parser));
        }
        if (tokIs(parser, Operators.LEFT_SQUARE_BRACKET)) {
            meta.push(parseMetaData(parser));
        } else if (tokIs(parser, Keywords.VAR)) {
            parseClassField(parser, result, modifiers, meta);
        } else if (tokIs(parser, Keywords.CONST)) {
            parseClassConstant(parser, result, modifiers, meta);
        } else if (tokIs(parser, Keywords.IMPORT)) {
            result.children.push(parseImport(parser));
        } else if (tokIs(parser, Keywords.INCLUDE) || tokIs(parser, Keywords.INCLUDE_AS2)) {
            result.children.push(parseIncludeExpression(parser));
        } else if (tokIs(parser, Keywords.FUNCTION)) {
            parseClassFunctions(parser, result, modifiers, meta);
        } else {
            tryToParseCommentNode(parser, result, modifiers);
        }
    }
    if (result.lastChild) {
        result.end = result.lastChild.end;
    }
    return result;
}


function parseClassField(parser:AS3Parser, result:Node, modifiers:Token[], meta:Node[]):void {
    let varList:Node = parseVarList(parser, meta, modifiers);
    result.children.push(varList);
    if (parser.currentAsDoc) {
        varList.children.push(parser.currentAsDoc);
        parser.currentAsDoc = null;
    }
    if (parser.currentMultiLineComment) {
        result.children.push(parser.currentMultiLineComment);
        parser.currentMultiLineComment = null;
    }
    if (tokIs(parser, Operators.SEMICOLON)) {
        nextToken(parser);
    }
    meta.length = 0;
    modifiers.length = 0;
}


function parseClassConstant(parser:AS3Parser, result:Node, modifiers:Token[], meta:Node[]):void {
    result.children.push(parseConstList(parser, meta, modifiers));
    if (tokIs(parser, Operators.SEMICOLON)) {
        nextToken(parser);
    }
    meta.length = 0;
    modifiers.length = 0;
}


function parseInterface(parser:AS3Parser, meta:Node[], modifier:Token[]):Node {
    let tok = consume(parser, Keywords.INTERFACE);
    let result:Node = createNode(NodeKind.INTERFACE, {start: tok.index});

    if (parser.currentAsDoc) {
        result.children.push(parser.currentAsDoc);
        parser.currentAsDoc = null;
    }
    if (parser.currentMultiLineComment) {
        result.children.push(parser.currentMultiLineComment);
        parser.currentMultiLineComment = null;
    }
    let name = parseQualifiedName(parser, true);
    result.children.push(createNode(NodeKind.NAME, {start: parser.tok.index, text: name}));

    result.children.push(convertMeta(parser, meta));
    result.children.push(convertModifiers(parser, modifier));

    if (tokIs(parser, Keywords.EXTENDS)) {
        nextToken(parser); // extends
        name = parseQualifiedName(parser, false);
        result.children.push(createNode(NodeKind.EXTENDS, {start: parser.tok.index, text: name}));
    }
    while (tokIs(parser, Operators.COMMA)) {
        nextToken(parser); // comma
        name = parseQualifiedName(parser, false);
        result.children.push(createNode(NodeKind.EXTENDS, {start: parser.tok.index, text: name}));
    }
    consume(parser, Operators.LEFT_CURLY_BRACKET);
    result.children.push(parseInterfaceContent(parser));
    tok = consume(parser, Operators.RIGHT_CURLY_BRACKET);
    result.end = tok.end;
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, tok.index);
    return result;
}


function parseInterfaceContent(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.CONTENT, {start: parser.tok.index});

    while (!tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
        if (tokIs(parser, Keywords.IMPORT)) {
            result.children.push(parseImport(parser));
        } else if (tokIs(parser, Keywords.FUNCTION)) {
            result.children.push(parseFunctionSignature(parser));
        } else if (tokIs(parser, Keywords.INCLUDE) || tokIs(parser, Keywords.INCLUDE_AS2)) {
            result.children.push(parseIncludeExpression(parser));
        } else if (tokIs(parser, Operators.LEFT_SQUARE_BRACKET)) {
            while (!tokIs(parser, Operators.RIGHT_SQUARE_BRACKET)) {
                nextToken(parser);
            }
            nextToken(parser);
        } else {
            tryToParseCommentNode(parser, result, null);
        }
    }
    if (result.lastChild) {
        result.end = result.lastChild.end;
    }
    return result;
}


function parseClassFunctions(parser:AS3Parser, result:Node, modifiers:Token[], meta:Node[]):void {

    result.children.push(parseFunction(parser, meta, modifiers));
    meta.length = 0;
    modifiers.length = 0;
}


function parseFunction(parser:AS3Parser, meta:Node[], modifiers:Token[]):Node {

    if(modifiers && modifiers.length === 0) {
        var line:number = parser.scn.getNumLineBreaksBeforeIndex();
        throw new Error("*** ERROR *** Class member modifier (public, private, internal) is required at line: " + line);
    }

    let {type, name, params, returnType} = doParseSignature(parser);
    let result:Node = createNode(findFunctionTypeFromTypeNode(type), {start: type.start, end: -1, text: type.text});

    //if(VERBOSE >= 2) {
    if((VERBOSE_MASK & ReportFlags.PARSER_FUNCTIONS) == ReportFlags.PARSER_FUNCTIONS) {
        console.log("parse-declarations.ts - parseFunction: " + name.text + "()" + ", line: " + parser.scn.lastLineScanned);
    }

    if (parser.currentAsDoc) {
        result.children.push(parser.currentAsDoc);
        parser.currentAsDoc = null;
    }
    if (parser.currentMultiLineComment) {
        result.children.push(parser.currentMultiLineComment);
        parser.currentMultiLineComment = null;
    }

    // Append dummy modifier to constructor
    if (modifiers.length === 0 && /^[A-Z]/.test(name.text)) {
        modifiers.push( new Token("public", type.start) )
    }

    result.children.push(convertMeta(parser, meta));
    result.children.push(convertModifiers(parser, modifiers));
    result.children.push(name);
    result.children.push(params);
    result.children.push(returnType);

    if (tokIs(parser, Operators.SEMICOLON)) {
        consume(parser, Operators.SEMICOLON);
    } else {
        result.children.push(parseFunctionBlock(parser));
    }
    parser.currentFunctionNode = null;
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, result.start);
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, 0);
    return result;
}


function parseFunctionSignature(parser:AS3Parser):Node {
    let {type, name, params, returnType} = doParseSignature(parser);
    skip(parser, Operators.SEMICOLON);
    let result:Node = createNode(
        type.kind,
        {start: type.start, end: -1, text: type.text},
        name,
        params,
        returnType);
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, 0);
    return result;
}


function doParseSignature(parser:AS3Parser) {

    // console.logparse-declarations.ts - doParseSignature()");

    let tok = consume(parser, Keywords.FUNCTION);
    let type:Node = createNode(NodeKind.TYPE, {tok: tok});

    let isGet = tokIs(parser, Keywords.GET);
    let isSet = tokIs(parser, Keywords.SET);

    if (isGet || isSet) {
        let currentToken = parser.tok;
        let checkpoint = parser.scn.getCheckPoint();

        nextToken(parser); // set or get
        let valid: boolean = (parser.tok.text !== "(");

        if (valid) {
            type = createNode((isGet) ? NodeKind.GET : NodeKind.SET, {
                start: tok.index,
                end: parser.tok.end,
                text: parser.tok.text
            });

        } else {
            parser.scn.rewind(checkpoint);
            parser.tok = currentToken;
        }

    }
    let name:Node = createNode(NodeKind.NAME, {tok: parser.tok});
    nextToken(parser); // name
    let params:Node = parseParameterList(parser);
    let returnType:Node = parseOptionalType(parser);
    return {type, name, params, returnType};
}


function findFunctionTypeFromTypeNode(node: Node):NodeKind {
    if (node.text === Keywords.SET || node.kind === NodeKind.SET) {
        return NodeKind.SET;
    }
    if (node.text === Keywords.GET || node.kind === NodeKind.GET) {
        return NodeKind.GET;
    }
    return NodeKind.FUNCTION;
}


function parseFunctionBlock(parser:AS3Parser):Node {
    let block:Node = createNode(NodeKind.BLOCK, {start: parser.tok.index});

    parser.currentFunctionNode = block;

    parseBlock(parser, block);

    return block;
}


export function parseVarList(parser:AS3Parser, meta:Node[], modifiers:Token[]):Node {
    if(modifiers && modifiers.length === 0) {
        var line:number = parser.scn.getNumLineBreaksBeforeIndex();
        throw new Error("*** ERROR *** Class member modifier (public, private, internal) is required at line: " + line);
    }
    let tok = consume(parser, Keywords.VAR);
    let result:Node = createNode(NodeKind.VAR_LIST, {start: tok.index, end: tok.end});
    result.children.push(convertMeta(parser, meta));
    result.children.push(convertModifiers(parser, modifiers));
    collectVarListContent(parser, result);
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, tok.index);
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, tok.end);
    return result;
}


export function parseConstList(parser:AS3Parser, meta:Node[], modifiers:Token[]):Node {
    let tok = consume(parser, Keywords.CONST);
    let result:Node = createNode(NodeKind.CONST_LIST, {start: tok.index});
    result.children.push(convertMeta(parser, meta));
    result.children.push(convertModifiers(parser, modifiers));
    collectVarListContent(parser, result);

    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, tok.index);
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, 0);

    return result;
}


function collectVarListContent(parser:AS3Parser, result:Node):Node {
    result.children.push(parseNameTypeInit(parser));
    while (tokIs(parser, Operators.COMMA)) {
        nextToken(parser, true);
        result.children.push(parseNameTypeInit(parser));
    }
    return result;
}


function tryToParseCommentNode(parser:AS3Parser, result:Node, modifiers:Token[]):void {
    if (startsWith(parser.tok.text, ASDOC_COMMENT)) {
        parser.currentAsDoc = createNode(NodeKind.AS_DOC, {start: parser.tok.index, end: -1, text: parser.tok.text});
        nextToken(parser);
    } else if (startsWith(parser.tok.text, MULTIPLE_LINES_COMMENT)) {
        result.children.push(createNode(NodeKind.MULTI_LINE_COMMENT, {
            start: parser.tok.index,
            end: -1,
            text: parser.tok.text
        }));
        nextToken(parser);
    } else {
        if (modifiers) {
            modifiers.push(parser.tok);
        }
        nextTokenIgnoringDocumentation(parser);
    }
}


function convertMeta(parser:AS3Parser, metadataList:Node[]):Node {
    if (!metadataList || metadataList.length === 0) {
        return null;
    }

    let result:Node = createNode(NodeKind.META_LIST, {start: parser.tok.index});
    result.children = metadataList ? metadataList.slice(0) : [];
    if (result.lastChild) {
        result.end = result.lastChild.end;
    }
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, result.start);
    return result;
}


function convertModifiers(parser:AS3Parser, modifierList:Token[]):Node {
    if (!modifierList) {
        return null;
    }

    let result:Node = createNode(NodeKind.MOD_LIST, {start: parser.tok.index});

    let end = parser.tok.index;
    result.children = modifierList.map(tok => {
        end = tok.end;
        return createNode(NodeKind.MODIFIER, {tok: tok});
    });
    result.end = end;
    result.start = result.children.reduce((index:number, child:Node) => {
        return Math.min(index, child ? child.start : Infinity);
    }, result.start);
    return result;
}

