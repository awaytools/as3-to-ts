import Node, {createNode} from '../syntax/node';
import NodeKind from '../syntax/nodeKind';
import * as Operators from '../syntax/operators';
import AS3Parser, {nextToken, consume, skip, tokIs} from "./parser";
import {parseExpression} from "./parse-expressions";
import {parseType} from "./parse-types";


export function parseArrayLiteral(parser:AS3Parser):Node {
    let tok = consume(parser, Operators.LEFT_SQUARE_BRACKET);
    let result:Node = createNode(NodeKind.ARRAY, {start: tok.index});
    while (!tokIs(parser, Operators.RIGHT_SQUARE_BRACKET)) {
        result.children.push(parseExpression(parser));
        skip(parser, Operators.COMMA);
    }
    result.end = consume(parser, Operators.RIGHT_SQUARE_BRACKET).end;
    //console.log(result);
    return result;
}


export function parseObjectLiteral(parser:AS3Parser):Node {
    let tok = consume(parser, Operators.LEFT_CURLY_BRACKET);
    let result:Node = createNode(NodeKind.OBJECT, {start: tok.index, end: tok.end});
    while (!tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
        result.children.push(parseObjectLiteralPropertyDeclaration(parser));
        skip(parser, Operators.COMMA);
    }
    tok = consume(parser, Operators.RIGHT_CURLY_BRACKET);
    result.end = tok.end;
    return result;
}


function parseObjectLiteralPropertyDeclaration(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.PROP, {start: parser.tok.index, end: parser.tok.end});
    let name:Node = createNode(NodeKind.NAME, {tok: parser.tok});
    result.children.push(name);
    nextToken(parser); // name
    consume(parser, Operators.COLUMN);
    let expr = parseExpression(parser);
    let val = createNode(NodeKind.VALUE, {start: parser.tok.index, end: expr.end}, expr);
    result.children.push(val);
    result.end = val.end;
    return result;
}


export function parseShortVector(parser:AS3Parser):Node {
    let vector:Node = createNode(NodeKind.VECTOR, {start: parser.tok.index});
    consume(parser, Operators.INFERIOR);
    vector.children.push(parseType(parser));
    vector.end = consume(parser, Operators.SUPERIOR).end;

    let arrayLiteral = parseArrayLiteral(parser);

    return createNode(NodeKind.SHORT_VECTOR, {start: vector.start, end: arrayLiteral.end}, vector, arrayLiteral);
}
