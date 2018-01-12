import Node, {createNode} from '../syntax/node';
import NodeKind from '../syntax/nodeKind';
import * as Keywords from '../syntax/keywords'
import * as Operators from '../syntax/operators'
import Token from './token';
import AS3Parser, {nextToken, nextTokenAllowNewLine, tryParse, consume, skip, tokIs} from './parser';
import {parseExpressionList, parseExpression, parsePrimaryExpression} from './parse-expressions';
import {parseVarList, parseConstList} from './parse-declarations';
import {parseBlock, parseNameTypeInit} from './parse-common';
import {NEW_LINE} from './parser';


export function parseStatement(parser:AS3Parser):Node {
    let result:Node;

    if (tokIs(parser, Keywords.FOR)) {
        result = parseFor(parser);
    } else if (tokIs(parser, Keywords.IF)) {
        result = parseIf(parser);
    } else if (tokIs(parser, Keywords.SWITCH)) {
        result = parseSwitch(parser);
    } else if (tokIs(parser, Keywords.DO)) {
        result = parseDo(parser);
    } else if (tokIs(parser, Keywords.WHILE)) {
        result = parseWhile(parser);
    } else if (tokIs(parser, Keywords.TRY)) {
        result = parseTry(parser);
    } else if (tokIs(parser, Keywords.CATCH)) {
        result = parseCatch(parser);
    } else if (tokIs(parser, Keywords.FINALLY)) {
        result = parseFinally(parser);
    } else if (tokIs(parser, Operators.LEFT_CURLY_BRACKET)) {
        result = parseBlock(parser);
    } else if (tokIs(parser, Keywords.VAR)) {
        result = parseVar(parser);
    } else if (tokIs(parser, Keywords.CONST)) {
        result = parseConst(parser);
    } else if (tokIs(parser, Keywords.RETURN)) {
        result = parseReturnStatement(parser);
    } else if (tokIs(parser, Keywords.THROW)) {
        result = parseThrowStatement(parser);
    } else if (tokIs(parser, Keywords.BREAK) || tokIs(parser, Keywords.CONTINUE)) {
        result = parseBreakOrContinueStatement(parser);
    } else if (tokIs(parser, Operators.SEMICOLON)) {
        result = parseEmptyStatement(parser);
    } else {
        result = parseExpressionList(parser);
        skip(parser, Operators.SEMICOLON);
    }
    return result;
}


function parseFor(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.FOR);

    if (tokIs(parser, Keywords.EACH)) {
        nextToken(parser);
        return parseForEach(parser, tok.index);
    } else {
        return parseTraditionalFor(parser, tok.index);
    }
}


function parseForEach(parser:AS3Parser, index:number):Node {
    consume(parser, Operators.LEFT_PARENTHESIS);

    let result:Node = createNode(NodeKind.FOREACH, {start: index});
    if (tokIs(parser, Keywords.VAR)) {
        let node:Node = createNode(NodeKind.VAR, {start: parser.tok.index});
        nextToken(parser);
        let child = parseNameTypeInit(parser);
        node.children.push(child);
        node.end = child.end;
        result.children.push(node);
    } else {
        result.children.push(createNode(NodeKind.NAME, {tok: parser.tok}));
        // names allowed?
        nextToken(parser);
    }
    index = parser.tok.index;
    nextToken(parser); // in
    let expr = parseExpression(parser);
    result.children.push(createNode(NodeKind.IN, {start: index, end: expr.end}, expr));
    consume(parser, Operators.RIGHT_PARENTHESIS);
    let statement = parseStatement(parser);
    result.children.push(statement);
    result.end = statement.end;
    return result;
}


function parseTraditionalFor(parser:AS3Parser, index:number):Node {
    consume(parser, Operators.LEFT_PARENTHESIS);

    let result:Node = createNode(NodeKind.FOR, {start: index});
    if (!tokIs(parser, Operators.SEMICOLON)) {
        if (tokIs(parser, Keywords.VAR)) {
            let varList = parseVarList(parser, null, null);
            result.children.push(createNode(NodeKind.INIT, {start: varList.start, end: varList.end}, varList));
        } else {
            parser.isInFor = true;
            let expr = parseExpression(parser);
            result.children.push(createNode(NodeKind.INIT, {start: expr.start, end: expr.end}, expr));
            parser.isInFor = false;
        }
        if (tokIs(parser, Keywords.IN)) {
            return parseForIn(parser, result);
        }
    }
    consume(parser, Operators.SEMICOLON);
    if (!tokIs(parser, Operators.SEMICOLON)) {
        let expr = parseExpression(parser);
        result.children.push(createNode(NodeKind.COND, {start: expr.start, end: expr.end}, expr));
    }
    consume(parser, Operators.SEMICOLON);
    if (!tokIs(parser, Operators.RIGHT_PARENTHESIS)) {
        let expr = parseExpressionList(parser);
        result.children.push(createNode(NodeKind.ITER, {start: expr.start, end: expr.end}, expr));
    }
    consume(parser, Operators.RIGHT_PARENTHESIS);
    result.children.push(parseStatement(parser));
    return result;
}


function parseForIn(parser:AS3Parser, result:Node):Node {
    let index = parser.tok.index;
    nextToken(parser);
    let expr = parseExpression(parser);
    result.children.push(createNode(NodeKind.IN, {start: index, end: expr.end}, expr));
    result.kind = NodeKind.FORIN;
    consume(parser, Operators.RIGHT_PARENTHESIS);
    return result;
}


function parseIf(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.IF);
    let result:Node = createNode(NodeKind.IF, {start: tok.index}, parseCondition(parser));
    result.children.push(parseStatement(parser));
    if (tokIs(parser, Keywords.ELSE)) {
        nextToken(parser, true);
        result.children.push(parseStatement(parser));
    }
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, 0);
    return result;
}


function parseSwitch(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.SWITCH);
    let result:Node = createNode(NodeKind.SWITCH, {start: tok.index, end: tok.end}, parseCondition(parser));
    if (tokIs(parser, Operators.LEFT_CURLY_BRACKET)) {
        nextToken(parser);
        result.children.push(parseSwitchCases(parser));
        result.end = consume(parser, Operators.RIGHT_CURLY_BRACKET).end;
    }
    return result;
}


function parseSwitchCases(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.CASES, {start: parser.tok.index, end: parser.tok.end});
    while (true) {
        if (tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
            break;
        } else if (tokIs(parser, Keywords.CASE)) {
            let index = parser.tok.index;
            nextToken(parser, true); // case
            let expr = parseExpression(parser);
            let caseNode:Node = createNode(NodeKind.CASE, {start: index, end: expr.end}, expr);
            consume(parser, Operators.COLUMN);
            let block = parseSwitchBlock(parser);
            caseNode.children.push(block);
            caseNode.end = block.end;
            result.children.push(caseNode);
        } else if (tokIs(parser, Keywords.DEFAULT)) {
            let index = parser.tok.index;
            nextToken(parser, true); // default
            consume(parser, Operators.COLUMN);
            let caseNode:Node = createNode(
                NodeKind.CASE,
                {start: index},
                createNode(NodeKind.DEFAULT, {start: index, end: parser.tok.end, text: Keywords.DEFAULT}));
            let block = parseSwitchBlock(parser);
            caseNode.end = block.end;
            caseNode.children.push(block);
            result.children.push(caseNode);
        }
    }
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, result.end);
    return result;
}


function parseSwitchBlock(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.SWITCH_BLOCK, {start: parser.tok.index, end: parser.tok.end});
    while (!tokIs(parser, Keywords.CASE) && !tokIs(parser, Keywords.DEFAULT) && !tokIs(parser, Operators.RIGHT_CURLY_BRACKET)) {
        result.children.push(parseStatement(parser));
    }
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, result.end);
    return result;
}


function parseDo(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.DO);
    let result:Node = createNode(NodeKind.DO, {start: tok.index}, parseStatement(parser));
    consume(parser, Keywords.WHILE);
    let cond = parseCondition(parser);
    result.children.push(cond);
    result.end = cond.end;
    if (tokIs(parser, Operators.SEMICOLON)) {
        nextToken(parser, true);
    }
    return result;
}


function parseWhile(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.WHILE);
    let result:Node = createNode(NodeKind.WHILE, {start: tok.index, end: tok.end});
    result.children.push(parseCondition(parser));
    result.children.push(parseStatement(parser));
    result.end = result.children.reduce((index:number, child:Node) => {
        return Math.max(index, child ? child.end : 0);
    }, tok.end);
    return result;
}


function parseTry(parser:AS3Parser):Node {
    let result:Node;
    let index = parser.tok.index;
    nextToken(parser, true);
    let block = parseBlock(parser);
    result = createNode(NodeKind.TRY, {start: index, end: block.end}, block);
    return result;
}


function parseCatch(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.CATCH);
    consume(parser, Operators.LEFT_PARENTHESIS);
    let result:Node = createNode(
        NodeKind.CATCH,
        {start: tok.index, end: tok.end},
        createNode(NodeKind.NAME, {tok: parser.tok}));
    nextToken(parser, true); // name
    if (tokIs(parser, Operators.COLUMN)) {
        nextToken(parser, true); // :
        result.children.push(createNode(NodeKind.TYPE, {tok: parser.tok}));
        nextToken(parser, true); // type
    }
    consume(parser, Operators.RIGHT_PARENTHESIS);
    let block = parseBlock(parser);
    result.children.push(block);
    result.end = block.end;
    return result;
}


function parseFinally(parser:AS3Parser):Node {
    let result:Node;
    let index = parser.tok.index;
    nextToken(parser, true);
    let block = parseBlock(parser);
    result = createNode(NodeKind.FINALLY, {start: index, end: block.end}, block);
    return result;
}


function parseVar(parser:AS3Parser):Node {
    let result:Node;
    result = parseVarList(parser, null, null);
    skip(parser, Operators.SEMICOLON);
    return result;
}


function parseConst(parser:AS3Parser):Node {
    let result = parseConstList(parser, null, null);
    skip(parser, Operators.SEMICOLON);
    return result;
}


function parseReturnStatement(parser:AS3Parser):Node {
    let result:Node;

    let index = parser.tok.index,
        end = parser.tok.end;
    nextTokenAllowNewLine(parser);
    if (tokIs(parser, NEW_LINE) || tokIs(parser, Operators.SEMICOLON)) {
        nextToken(parser, true);
        result = createNode(NodeKind.RETURN, {start: index, end: end});
    } else {
        let expr = parseExpression(parser);
        result = createNode(NodeKind.RETURN, {start: index, end: expr.end}, expr);
        skip(parser, Operators.SEMICOLON);
    }
    return result;
}


function parseThrowStatement(parser:AS3Parser):Node {
    let tok = consume(parser, Keywords.THROW);
    let expr = parseExpression(parser);

    return createNode(NodeKind.RETURN, {start: tok.index, end: expr.end}, expr);
}


function parseBreakOrContinueStatement(parser:AS3Parser):Node {
    let tok:Token = parser.tok;
    let kind:NodeKind;
    if (tokIs(parser, Keywords.BREAK) || tokIs(parser, Keywords.CONTINUE)) {
        kind = tokIs(parser, Keywords.BREAK) ? NodeKind.BREAK : NodeKind.CONTINUE;
        nextToken(parser);
    } else {
        let pos = parser.sourceFile.getLineAndCharacterFromPosition(parser.tok.index);
        throw new Error('unexpected token : ' +
            parser.tok.text + '(' + pos.line + ',' + pos.col + ')' +
            ' in file ' + parser.sourceFile.path +
            'expected: continue or break'
        );
    }
    let result:Node;
    if (tokIs(parser, NEW_LINE) || tokIs(parser, Operators.SEMICOLON)) {
        nextToken(parser, true);
        result = createNode(kind, {start: tok.index, end: tok.end});
    } else {
        let ident = tryParse(parser, () => {
            let expr = parsePrimaryExpression(parser);
            if (expr.kind === NodeKind.IDENTIFIER) {
                return expr;
            } else {
                throw new Error();
            }
        });
        if (!ident) {
            let pos = parser.sourceFile.getLineAndCharacterFromPosition(parser.tok.index);
            throw new Error(
                `unexpected token : ${parser.tok.text}(${pos.line},${pos.col})` +
                ` in file ${ parser.sourceFile.path } expected: ident`
            );
        }
        result = createNode(kind, {start: tok.index, end: ident.end}, ident);
    }
    skip(parser, Operators.SEMICOLON);
    return result;
}


function parseEmptyStatement(parser:AS3Parser):Node {
    let result:Node = createNode(NodeKind.STMT_EMPTY, {tok: parser.tok});
    nextToken(parser, true);
    return result;
}


function parseCondition(parser:AS3Parser):Node {
    let tok = consume(parser, Operators.LEFT_PARENTHESIS);
    let result:Node = createNode(NodeKind.CONDITION, {start: tok.index}, parseExpression(parser));
    tok = consume(parser, Operators.RIGHT_PARENTHESIS);
    result.end = tok.end;
    return result;
}

