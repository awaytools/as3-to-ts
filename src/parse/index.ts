import Node from '../syntax/node';
import AS3Parser from './parser';
import SourceFile from './source-file';
import AS3Scanner from './scanner';
import {parseCompilationUnit} from './parse-declarations';
import {VERBOSE_MASK, WARNINGS} from '../config';
import {ReportFlags} from '../reports/report-flags';

export default function parse(filePath:string, content:string):Node {

    //if(VERBOSE >= 1) {

    if((VERBOSE_MASK & ReportFlags.KEY_POINTS) == ReportFlags.KEY_POINTS) {
        console.log("parse() ⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣⇣");
    }

    let parser = new AS3Parser();
    parser.sourceFile = new SourceFile(content, filePath);
    parser.scn = new AS3Scanner();
    parser.scn.setContent(content);
    return parseCompilationUnit(parser);
}
