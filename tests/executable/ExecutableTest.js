const utils = require('../../wrappers/ConversionUtils.js');
const fs = require('fs-extra');
const path = require('path');
const parse = require('../../lib/parse');
const emit = require('../../lib/emit');
const colors = require('colors');
const jsdiff = require('diff');
const ts = require('typescript');
const execSync = require('child_process').execSync;

/*
  Converts all as3 files in tests/simple/as3 to typescript files in tests/simple/ts-generated
  and compares the output.

  All files are treated independently and there is no special multipass mechanism nor
  inter-relation between the transpiled files.
 */

// Process incoming CLI arguments.
// ***********************************************************************
const params = utils.processArgs(process.argv);
const showdiff = params['showdiff']; // when outputs don't match, display the lines that don't match
let focusedSourceFiles = params['focused']; // focus on a set of files
let ignoredSourceFiles = params['ignored']; // ignore a set of files
const tsc = params['tsc']; // convert ts output to js in /js-generated
const run = params['run']; // run js output (requires tsc)
// ***********************************************************************

// Configuration settings used in this script:
const sourceDirectory = path.resolve(__dirname, './as3-executable');
const helperDirectory = path.resolve(__dirname, '../helpers');
const destinationDirectory = path.resolve(__dirname, './ts-generated');
const destinationJSDirectory = path.resolve(__dirname, './js-generated');
const emitterOptions = {
  lineSeparator: '\n',
  definitionsByNamespace: {},
  customVisitors: utils.instantiateVisitorsFromStr(
    'trace,' +
    'dictionary,' +
    'flash-errors,' +
    'gettimer,' +
    'stringutil,' +
    'trace,' +
    'xml,' +
    'imports,' +
    'imports_toplevel,' +
    'types',
    '../lib/custom-visitors/'
  )
};

/*// Clean output directories.
utils.clearDirectory(destinationDirectory);
utils.clearDirectory(sourceTempDirectory);
console.log(colors.green("  1. Clear temp and output directories"));

// Collect all files in tmp dir and resolve includes.
utils.collectSources([sourceDirectory], sourceTempDirectory);
console.log(colors.green("  2. Collect sources into tmp dir and resolve includes"));

utils.collectSources([helperDirectory], sourceTempDirectory);
console.log(colors.green("  3. Collect helpers into tmp dir and resolve includes"));*/

// Collect all files.
if(focusedSourceFiles) {
  focusedSourceFiles = focusedSourceFiles.split(',');
}
if(ignoredSourceFiles) {
  ignoredSourceFiles = ignoredSourceFiles.split(',');
}
let as3Files = utils.readdir(sourceDirectory).filter(file => /.as$/.test(file));

console.log("Running simple conversion tests on " + as3Files.length + " files...\n");

// For each as3 file, convert and test...
let passed = 0;
let tested = 0;
as3Files.forEach(file => {

  // Identify source file.
  let as3File = path.resolve(sourceDirectory, file);
  let segments = file.match(/([a-zA-Z0-9]+)/g);
  segments.pop();
  let identifier = segments.pop();

  // Focus or ignore?
  if(focusedSourceFiles && focusedSourceFiles.indexOf(identifier) === -1) {
    return;
  }
  if(ignoredSourceFiles && ignoredSourceFiles.indexOf(identifier) !== -1) {
    return;
  }
  tested++;

  // Identify source/target files.
  let outputFile = path.resolve(destinationDirectory, identifier + ".ts");

  // Convert as3 -> ts.
  let content = fs.readFileSync(as3File, 'UTF-8');
  let ast = parse(path.basename(file), content);
  let contents = emit(ast, content, emitterOptions);
  contents = contents.replace(/\r\n?/g, '\n');
  contents = contents.replace(/\s([^\n])\s*?=>/gm, " =>");

  // Apply custom visitors postprocessing.
  emitterOptions.customVisitors.forEach(visitor => {
    if (visitor.postProcessing) {
      contents = visitor.postProcessing(emitterOptions, contents);
    }
  });

  // Write converted ts output.
  fs.outputFileSync(outputFile, contents);


    passed++;
  // Convert to js?
  if(tsc) {
    console.log(colors.blue('      ↳' + identifier + '.ts -> ' + identifier + '.js'));

    // Compile typescript to javascript.
    let compileOptions =   {"target":2};
    let transpileOptions  =   {"compileOptions":compileOptions};
    let jsCode = ts.transpileModule(contents, transpileOptions).outputText;

    // Write converted js output.
    const jsFile = path.resolve(destinationJSDirectory, identifier + ".js");
    fs.outputFileSync(jsFile, jsCode);

    // Run js?
    if(run) {
      console.log(colors.cyan('       (exec)'));
      try {
        let childProcess = execSync('node ' + destinationJSDirectory + '/' + identifier + '.js', {stdio: 'pipe'});
        let stdout = childProcess.toString();
        let lines = stdout.split('\n');
        console.log(stdout);
        for(let i = 0; i < lines.length; i++) {
          console.log(colors.cyan('        ', lines[i]));
        }
      }
      catch(err) {
        console.log(colors.cyan('        ', err));
      }
    }
  }
});

// Summary
if(passed < tested) {
  console.log(colors.red.inverse('\n  ☠☠☠️' + (tested - passed) + ' tests failed ☠☠☠️\n'));
}
else {
  console.log(colors.blue.inverse('\n  ⚑ All tests passed! \n'));
}