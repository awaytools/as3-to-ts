/**
 *    Copyright (c) 2009, Adobe Systems, Incorporated
 *    All rights reserved.
 *
 *    Redistribution  and  use  in  source  and  binary  forms, with or without
 *    modification,  are  permitted  provided  that  the  following  conditions
 *    are met:
 *
 *      * Redistributions  of  source  code  must  retain  the  above copyright
 *        notice, this list of conditions and the following disclaimer.
 *      * Redistributions  in  binary  form  must reproduce the above copyright
 *        notice,  this  list  of  conditions  and  the following disclaimer in
 *        the    documentation   and/or   other  materials  provided  with  the
 *        distribution.
 *      * Neither the name of the Adobe Systems, Incorporated. nor the names of
 *        its  contributors  may be used to endorse or promote products derived
 *        from this software without specific prior written permission.
 *
 *    THIS  SOFTWARE  IS  PROVIDED  BY THE  COPYRIGHT  HOLDERS AND CONTRIBUTORS
 *    "AS IS"  AND  ANY  EXPRESS  OR  IMPLIED  WARRANTIES,  INCLUDING,  BUT NOT
 *    LIMITED  TO,  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 *    PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER
 *    OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,  INCIDENTAL,  SPECIAL,
 *    EXEMPLARY,  OR  CONSEQUENTIAL  DAMAGES  (INCLUDING,  BUT  NOT  LIMITED TO,
 *    PROCUREMENT  OF  SUBSTITUTE   GOODS  OR   SERVICES;  LOSS  OF  USE,  DATA,
 *    OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 *    LIABILITY,  WHETHER  IN  CONTRACT,  STRICT  LIABILITY, OR TORT (INCLUDING
 *    NEGLIGENCE  OR  OTHERWISE)  ARISING  IN  ANY  WAY  OUT OF THE USE OF THIS
 *    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import SourceFile from './source-file';
import AS3Scanner from './scanner';
import Token from './token';
import Node from '../syntax/node';
import {startsWith} from '../string';

export const ASDOC_COMMENT = '/**';
export const MULTIPLE_LINES_COMMENT = '/*';
export const NEW_LINE = '\n';
const SINGLE_LINE_COMMENT = '//';
export const VECTOR = 'Vector';

/**
 * @author xagnetti
 */
export default class AS3Parser {
    sourceFile:SourceFile;
    currentAsDoc:Node;
    currentFunctionNode:Node;
    currentMultiLineComment:Node;
    isInFor:boolean = false;
    scn:AS3Scanner;
    tok:Token;
}


export function nextToken(parser:AS3Parser, ignoreDocumentation:boolean = false):void {
    do {
        if (ignoreDocumentation) {
            nextTokenIgnoringDocumentation(parser);
        } else {
            nextTokenAllowNewLine(parser);
        }
    }
    while (parser.tok.text === NEW_LINE);
}


export function tryParse<T>(parser:AS3Parser, func:() => T):T {
    let checkPoint = parser.scn.getCheckPoint();
    try {
        return func();
    } catch (e) {
        parser.scn.rewind(checkPoint);
        return null;
    }
}


/**
 * Compare the current token to the parameter. If it equals, get the next
 * token. If not, throw a runtime exception.
 */
export function consume(parser:AS3Parser, text:string):Token {
    while (startsWith(parser.tok.text, '//')) {
        nextToken(parser);
    }

    if (!tokIs(parser, text)) {
        /*throw new UnExpectedTokenException(parser.tok.text,
         new Position(parser.tok.index, parser.tok.getColumn()),
         fileName,
         text);*/

        let pos = parser.sourceFile.getLineAndCharacterFromPosition(parser.tok.index);
        let msg =
            `unexpected token : ${parser.tok.text}(${pos.line},${pos.col}) ` +
            `in file ${parser.sourceFile.path} expected: ${text}`;
        throw new Error(msg);
    }
    let result = parser.tok;
    nextToken(parser);
    return result;
}


/**
 * Get the next token Skip comments but keep newlines We need parser method for
 * beeing able to decide if a returnStatement has an expression
 *
 * @throws UnExpectedTokenException
 */
export function nextTokenAllowNewLine(parser:AS3Parser):void {
    do {
        let lastTok = parser.tok;
        parser.tok = parser.scn.nextToken();

        if (!parser.tok) {
            let {line, col} = parser.sourceFile.getLineAndCharacterFromPosition(lastTok.index);
            throw new Error(`failed to parse token after ${parser.sourceFile.path}:(${line},${col})`);

        }
        if (parser.tok.text === null) {
            throw new Error(parser.sourceFile.path); //TODO throw new NullTokenException(fileName);
        }
    }
    while (startsWith(parser.tok.text, SINGLE_LINE_COMMENT));
}


export function nextTokenIgnoringDocumentation(parser:AS3Parser):void {
    do {
        nextToken(parser);
    }
    while (startsWith(parser.tok.text, MULTIPLE_LINES_COMMENT));
}


export function skip(parser:AS3Parser, text:string):void {
    if (tokIs(parser, text)) {
        nextToken(parser);
    }
}


export function tokIs(parser:AS3Parser, text:string):boolean {
    return parser.tok.text === text;
}
