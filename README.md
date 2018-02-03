# as3-to-ts

> A tool that helps porting as3 codebase to typescript

This fork has major improvements parsing and emitting code. It has also a custom
node visitor that allows extending the default behaviour.

This project is a fork of
[simonbuchan/as3-to-typescript](https://github.com/simonbuchan/as3-to-typescript),
which is a fork of [the original
as3-to-typescript](https://github.com/fdecampredon/as3-to-typescript)
implementation.

## Projects ported using `as3-to-ts`

- [RobotlegsJS](https://github.com/GoodgameStudios/RobotlegsJS)
- [SignalsJS](https://github.com/GoodgameStudios/SignalJS)

## Installation

**Option 1: via npm:**:

```
npm install -g as3-to-ts
```

**Option 2: building the source:**

Make sure you have [Node v6+](https://nodejs.org/) installed.

- Clone the repository
- Run `npm link`

You should have `as3-to-ts` now globaly available in your commandline.

If you want to run the test suite using `npm test`, run `npm link @as3web/as3-to-ts` in the as3-to-ts folder. 

## Usage

```
as3-to-ts <sourceDir> <outputDir> [--commonjs] [--visitors dictionary,stringutil,createjs] [--interactive] [--overwrite]
```

Options:

- `--commonjs`: export .ts files using CommonJS's import style.
- `--visitors [name]`: use custom visitors, separated by comma. implemented
  under `src/custom-visitor/[name]` (currently available: `dictionary`,
  `stringutil`, `createjs`)
- `--overwrite`: force overwrite of previously-converted files.
- `--interactive`: if you've manually changed a generated `.ts` file, you'll be
  asked if you want to overwrite it or not.


## Known issues

- `super` calls on constructor need to be moved as the first call after conversion.
- having a comment on `extends` statement causes infinite loop parsint the `.as` file.
- having `break` without a semicolon results in infinite loop parsing the `.as` file.
- having a method without access level will throw `Error: invalid consume`.
  (usually this is result of bad copy & paste without renaming the class constructor)
- having inline multiline comment break the parser (`var i = (/*comment*/true)`)
- namespaces can't have TypeScript keywords, such as `enum`, `class`, etc. (not
  an issue if transpiled using `--commonjs`)
- multiple property definitions generate invalid syntax (`public var velocityX:Number, velocityY:Number;`)

## Note

This tool will not magicly transform your as3 codebase into perfect typescript, the goal is to transform the sources into *syntacticly* correct typescript, and even this goal is not perfectly respected. It also won't try to provide javascript implementation for flash libraries.

However unlike most attempts that I have seen this tool is based on a true actionscript parser, and so should be able to handle most of as3 constructs and greatly ease the pain of porting a large code base written in as3 to typescript.
