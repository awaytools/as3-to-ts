const fs = require('fs-extra');
const path = require('path');
const parse = require('../lib/parse');
const emit = require('../lib/emit');
const getClassesList = require('../lib/classlist');
const colors = require('colors');

// Processes incoming argv params into a dictionary where
// myOption to params[myOption] = true
// myKey=myKeyVal to params[myKey] = myKeyVal
// expects arguments: process.argv
function processArgs(arguments) {
  let nextArgIdx = 2;
  let nextArg = arguments[nextArgIdx];
  let params = {};
  while (nextArg) {
    if (nextArg.indexOf('=') !== -1) {
      const dump = nextArg.split('=');
      const key = dump[0];
      const val = dump[1];
      params[key] = val;
    }
    else {
      params[nextArg] = true;
    }
    nextArgIdx++;
    nextArg = arguments[nextArgIdx];
  }
  return params;
}

// Deletes all files within a directory.
function clearDirectory(dir) {
  fs.emptyDirSync(dir);
}

function clearDirectories(dirArr) {
  for(let i = 0; i < dirArr.length; i++) {
    const dir = dirArr[i];
    clearDirectory(dir);
  }
}

// Receives a string with comma separated visitor names and
// returns an array of instantiated visitors
function instantiateVisitorsFromStr(visitors, baseUrl) {
  // console.log('instantiating visitors: ' + visitors);
  return visitors.split(',').map(
    (name) => {
      const visitor = require(`${baseUrl}${name}`).default;
      return visitor
    }
  );
}

// Reads all files and folders within a directory.
function readdir(dir, prefix, result) {
  // console.log('readdir - ', dir, prefix, result);

  if (!prefix) prefix = '';
  if (!result) result = [];

  fs.readdirSync(dir).forEach(file => {
    let fileName = path.join(prefix, file);
    let filePath = path.join(dir, file);
    if (!fs.statSync(filePath).isDirectory()) {
      result.push(fileName);
    } else {
      readdir(filePath, fileName, result);
    }
  });
  return result;
}

// Reads the contents of a file, normalizing line breaks.
function readNormalizedSync(path) {
  return fs.readFileSync(path, 'UTF-8').replace(/\r\n?/g, '\n');
}

// Collects all sources from passed directory into tmp directory,
// and resolves includes.
function collectSources(sourceDirectories, tmpDirectory, focusedSourceFiles) {
  for (let i = 0; i < sourceDirectories.length; i++) {
    let src = sourceDirectories[i];

    // Identify all files in source dir, recursively.
    let filesSNP = readdir(src).filter(file => /.snp/.test(file));
    let filesAS = readdir(src).filter(file => /.as$/.test(file));
    let files = filesSNP.concat(filesAS); // NOTE: its imporant that snippets go first

    files.forEach(file => {

      let inputFile = path.resolve(src, file);

      // Identify source file.
      let segments = inputFile.match(/([a-zA-Z0-9]+)/g);
      segments.pop();
      let identifier = segments.pop();

      // Focus or ignore?
      if(focusedSourceFiles && focusedSourceFiles.indexOf(identifier) === -1) {
        return;
      }

      // resolve the includes and write prepared output to tmp directory:
      let content = fs.readFileSync(inputFile, 'UTF-8');
      content = resolveIncludes(content, file, src);
      fs.outputFileSync(path.resolve(tmpDirectory, file), content.replace(/\r\n?/g, '\n'));
    });
  }
}

// Injects includes in files, hoisting their import statements
// to the top of the host file.
function resolveIncludes(contents, filePath, rootPath) {

  // Matches includes in the incoming contents.
  const regex = /include "([^\n])*/gm;

  // Identify the snippets to import.
  const snippets = contents.match(regex);
  if (!snippets || snippets.length === 0) {
    return contents;
  }

  // For each identified snippet...
  let allImports = [];
  for (let i = 0; i < snippets.length; i++) {

    const snippet = snippets[i];
    let relativePathToSnp = snippet.split('"')[1];

    // Load the contents of the snippet.
    try {

      let finalPath = path.resolve(rootPath, filePath, "../", relativePathToSnp);
      let cont = fs.readFileSync(finalPath, 'utf8');

      // filter our the imports:
      const regex2 = /import ([a-zA-Z0-9.;])*/gm;
      allImports = allImports.concat(cont.match(regex2));
      cont = cont.replace(regex2, "");

      // remove empty lines from remaining content
      cont = cont.replace(/^\s*[\r\n]/gm, "");

      // replace the include statement with the non-import code copied from the snippet
      contents = contents.replace(snippet, cont);
    }
    catch (e) {
      console.log("*** WARNING *** Snippet content not converted/loaded yet.");
    }
  }

  if (allImports.length > 0) {

    // if we found any imports, we need to inject them into the as3 file
    // they need to be the correct position, after the first "{"

    let all_content = contents.split("{");
    let newcontent = all_content[0] + "{\n";

    for (let i = 0; i < allImports.length; i++) {
      if (contents.indexOf(allImports[i]) === -1) {
        newcontent += allImports[i] + "\n";
      }
    }
    for (let i = 1; i < all_content.length; i++) {
      newcontent += all_content[i];
      if (i !== (all_content.length - 1)) {
        newcontent += "{";
      }
    }
    contents = newcontent;
  }

  return contents;
}

// Sweeps files and makes sure all used namespaces are populated in
// the emitter options definitionsByNamespace property.
function populateNamespaces(sourceFolder, emitterOptions) {

  // Get a list of as3 files from the tmp folder.
  let filesAS = readdir(sourceFolder).filter(file => /.as$/.test(file));

  // Sweep all as files && collect namespaces from the file names.
  filesAS.forEach(file => {

    // Identify source file.
    let segments = file.match(/([a-zA-Z0-9]+)/g);
    segments.pop();
    let identifier = segments.pop();
    let ns = segments.join(".");

    if (!emitterOptions.definitionsByNamespace[ns]) {
      emitterOptions.definitionsByNamespace[ns] = [];
    }

    emitterOptions.definitionsByNamespace[ns].push( identifier );
  });
}

function convertSources(sourceFolder, destinationFolder, emitterOptions) {

  // Get a list of as3 files from the tmp folder.
  let filesAS = readdir(sourceFolder).filter(file => /.as$/.test(file));

  // Sweep all files.
  filesAS.forEach(file => {
    let inputFile = path.resolve(sourceFolder, file);

    // Identify source file.
    let segments = file.match(/([a-zA-Z0-9]+)/g);
    segments.pop();
    let identifier = segments.pop();
    console.log(colors.blue("    ✔ " + identifier));

    // Check if the file is contained directly in the root-directory (output),
    // and not inside any subfolder
    let isFileInRoot = (segments.length === 0);

    // Identify source/target files.
    let fileTs = file.replace(/.as$/, '.ts').replace(/.snp$/, '.ts');
    let outputFile = path.resolve(destinationFolder, fileTs);

    // Convert.
    let content = fs.readFileSync(inputFile, 'UTF-8');
    let ast;
    try { ast = parse(path.basename(file), content); }
    catch(err) { console.log(err); }
    let contents;
    try { contents = emit(ast, content, emitterOptions); }
    catch(err) { console.log(err); }

    // Apply custom visitors postprocessing (needed for imports visitor).
    emitterOptions.customVisitors.forEach((visitor) => {
      if(!visitor.postProcessing) {
        return;
      }
      if(visitor.rootLevelOnly){
        if(isFileInRoot) {
          contents = visitor.postProcessing(emitterOptions, contents);
        }
      }
      else {
        contents = visitor.postProcessing(emitterOptions, contents);
      }
    });

    // Write converted output.
    fs.outputFileSync(outputFile, contents.replace(/\r\n?/g, '\n'));
    // fs.outputFileSync(outputFile + ".ast", JSON.stringify(ast, null, 2)); // uncomment to output AST file
  });
    let libraryFile = path.resolve(destinationFolder, "./Library.ts");
    let libContent = getClassesList();
    if (libContent)
    {
        fs.outputFileSync(libraryFile, libContent);
    }
    //fs.outputFileSync(libraryFile, );

}

function loadExternalNamespaces(namespaces, emitterOptions) {
  namespaces.createExternalPackageDefinitions(emitterOptions.definitionsByNamespace);
}

module.exports = {
  readdir: readdir,
  readNormalizedSync: readNormalizedSync,
  instantiateVisitorsFromStr: instantiateVisitorsFromStr,
  clearDirectory: clearDirectory,
  clearDirectories: clearDirectories,
  processArgs: processArgs,
  collectSources: collectSources,
  resolveIncludes: resolveIncludes,
  convertSources: convertSources,
  populateNamespaces: populateNamespaces,
  loadExternalNamespaces: loadExternalNamespaces
};