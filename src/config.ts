import {ReportFlags} from './reports/report-flags';

//export const VERBOSE = 3; // 0 none, 1 some, 2 a lot, 3 everything
// export const VERBOSE_MASK = ReportFlags.CREATE_NODES | ReportFlags.PARSER_POINTS | ReportFlags.KEY_POINTS;//Just place here flags divided br BITWISE OR "|"
export const VERBOSE_MASK = ReportFlags.LOG_NOTHING;
export const WARNINGS = 0; // 0 none, 1 some, 2 a lot, 3 everything
export const FOR_IN_KEY = '__$nflvKey';
export const FOR_IN_OBJ = '__$nflvObject';
export const INTERFACE_INF = '__interfaces__';
export const AS3_UTIL = 'AS3Utils';
export const INTERFACE_METHOD = 'isInstanceOfInterface';
export const INDENT = '    ';

// *** CURRENTLY NOT WORKING ***
export const AUTO_INSERT_SEMICOLONS = 1; // 0 no, 1 yes