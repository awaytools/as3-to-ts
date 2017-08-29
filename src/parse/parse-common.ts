import Node, {createNode} from '../syntax/node';
import NodeKind from '../syntax/nodeKind';
import * as Operators from '../syntax/operators';
import {VERBOSE_MASK} from '../config';
import {startsWith} from '../string';
import AS3Parser, {nextToken, consume, tokIs} from './parser';
import {MULTIPLE_LINES_COMMENT} from './parser';
import {parseStatement} from './parse-statements';
import {parseExpression} from './parse-expressions';
import {parseOptionalType} from './parse-types';
import {ReportFlags} from '../reports/report-flags';


export function parseQualifiedName(parser:AS3Parser, skipPackage:boolean):string {
    let buffer = '';

    buffer += parser.tok.text;
    nextToken(parser);
    while (tokIs(parser, Operators.DOT) || tokIs(parser, Operators.DOUBLE_COLUMN)) {
        buffer += parser.tok.text;
        nextToken(parser);
        buffer += parser.tok.text;
        nextToken(parser); // name
    }

    if (skipPackage) {
        return buffer.substring(buffer.lastIndexOf(Operators.DOT) + 1);
    }
    return buffer;
}


export function parseBlock(parser:AS3Parser, result?:Node):Node {

    //if(VERBOSE >= 2) {
    if((VERBOSE_MASK & ReportFlags.PARSER_POINTS) == ReportFlags.PARSER_POINTS) {

        console.log("parseBlock()" + ", line: " + parser.scn.lastLineScanned);
    }

    let tok = consume(parser, Operators.LEFT_CURLY_BRACKET);
    if (!result) {
        result = createNode(NodeKind.BLOCK, {start: tok.index, end: parser.tok.end});
    } else {
        result.start = tok.index;
    }
    //if(VERBOSE >= 2) {
    if((VERBOSE_MASK & ReportFlags.PARSER_POINTS) == ReportFlags.PARSER_POINTS) {
        console.log("token: " + parser.tok.text + ", index: " + parser.tok.index + ", line: " + parser.scn.lastLineScanned);
    }
    while (!tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
        //if(VERBOSE >= 3) {
        if((VERBOSE_MASK & ReportFlags.PARSER_DETAILS) == ReportFlags.PARSER_DETAILS) {
            console.log("parseBlock() - iter");
        }
        if (startsWith(parser.tok.text, MULTIPLE_LINES_COMMENT)) {
            parser.currentFunctionNode.children.push(
                createNode(NodeKind.MULTI_LINE_COMMENT, {tok: parser.tok}));
            nextToken(parser);
        } else {
            result.children.push(parseStatement(parser));
        }
    }
    result.end = consume(parser, Operators.RIGHT_CURLY_BRACKET).end;
    return result;
}


export function parseParameterList(parser:AS3Parser):Node {
    let tok = consume(parser, Operators.LEFT_PARENTHESIS);

    let result:Node = createNode(NodeKind.PARAMETER_LIST, {start: tok.index});
    while (!tokIs(parser, Operators.RIGHT_PARENTHESIS)) {
        result.children.push(parseParameter(parser));
        if (tokIs(parser, Operators.COMMA)) {
            nextToken(parser, true);
        } else {
            break;
        }
    }
    tok = consume(parser, Operators.RIGHT_PARENTHESIS);
    result.end = tok.end;
    return result;
}


/**
 * tok is the name of a parameter or ...
 */
function parseParameter(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.PARAMETER, {start: parser.tok.index});
    if (tokIs(parser, Operators.REST_PARAMETERS)) {
        let index = parser.tok.index;
        nextToken(parser, true); // ...
        let rest:Node = createNode(NodeKind.REST, {start: index, end: parser.tok.end, text: parser.tok.text});
        nextToken(parser, true); // rest
        result.children.push(rest);
    } else {
        result.children.push(parseNameTypeInit(parser));
    }
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, result.end);
    return result;
}


export function parseNameTypeInit(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.NAME_TYPE_INIT, {start: parser.tok.index});
    result.children.push(createNode(NodeKind.NAME, {tok: parser.tok}));
    nextToken(parser, true); // name
    result.children.push(parseOptionalType(parser));
    result.children.push(parseOptionalInit(parser));
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, result.end);
    return result;
}


/**
 * if tok is "=" parse the expression otherwise do nothing
 *
 * @return
 */
function parseOptionalInit(parser:AS3Parser):Node {
    let result:Node = null;
    if (tokIs(parser, Operators.EQUAL)) {
        nextToken(parser, true);
        let index = parser.tok.index;
        let expr = parseExpression(parser);
        result = createNode(NodeKind.INIT, {start: index, end: expr.end}, expr);
    }
    return result;
}
