import * as Keywords from '../syntax/keywords';
import {VERBOSE_MASK} from "../config";
//TODO Move from static to emmiterOptions
//TODO Move from parser
export default class ClassList {
    public static classList:Array<ClassRecord> = [];
    public static isScanning:boolean = true;
    public static currentClassRecord:ClassRecord;
    //public static addClass(className:string, packagePath:string):void{
    public static addClass(classRecord:ClassRecord):void{
        if (ClassList.isScanning == false) return;
        if (ClassList.classList.indexOf(classRecord) < 0)		{
            ClassList.classList.push(classRecord);
        }
    }

    public static setCurrentClassRecord(classRecord:ClassRecord):void{
        //currentClassRecord
        let classes = ClassList.classList;
        for (var i = 0; i < classes.length; i++) {
            let targetClassRecord = classes[i];
            if (targetClassRecord.className == classRecord.className && targetClassRecord.packageName == classRecord.packageName)
            {

                ClassList.currentClassRecord = targetClassRecord;
                let ext:string = targetClassRecord.extended ? targetClassRecord.extended.getFullPath() : "null";
                if ((VERBOSE_MASK & ReportFlags.EXT_AST_SHOW_ALL_EXTENDS) == ReportFlags.EXT_AST_SHOW_ALL_EXTENDS) {
                    if (targetClassRecord.extended)
                    {
                        console.log(">>>Class " + targetClassRecord.getFullPath() + " extends " + targetClassRecord.extended.getFullPath());
                    }
                }
                if ((VERBOSE_MASK & ReportFlags.EXT_AST_SHOW_IMPLEMENTS) == ReportFlags.EXT_AST_SHOW_IMPLEMENTS) {
                    if (targetClassRecord.interfaces.length > 0)
                    {
                        for (var j = 0; j < targetClassRecord.interfaces.length; j++) {
                            var implementsRecord = targetClassRecord.interfaces[j];
                            console.log("<<<Class " + targetClassRecord.getFullPath() + " implements " + implementsRecord.getFullPath());
                        }

                    }

                }
                return
            }

        }
        ClassList.currentClassRecord = null;
    }

    public static getLastPathToRoot():string{
       let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];

       let packages = classRecord.packageName.split(".");
       let packageLevel:number = 0
       if (packages.length < 2) {
           if (packages[0].length > 0) {
               packageLevel = 1;
           } else {
               packageLevel = 0;
           }
       } else	{
           packageLevel = packages.length;
       }
       let path = packageLevel == 0 ? "./" : "" ;
       for (var i = 0; i < packageLevel; i++) {
           path += "../";
       }
       return path
    }

    public static addClassMemberToLast(classMember:ClassMember):void{
        if (ClassList.isScanning == false) return;
        let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];
        {
            classRecord.children.push(classMember);
        }
    }
    public static addStaticMemberToLast(classMember:ClassMember):void{
        if (ClassList.isScanning == false) return;
        let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];
        if (classRecord)
        {
            classRecord.statics.push(classMember);
        }
    }

    public static addImportToLast(importStr:string):void{
        if (ClassList.isScanning == false) return;
        let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];
        if (classRecord && classRecord.imports.indexOf(importStr) < 0)
        {
            classRecord.imports.push(importStr);
        }
    }

    public static addInterfaceToLast(interfaceStr:string):void{
        if (ClassList.isScanning == false) return;
        let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];
        if (classRecord && classRecord.interfacesStrs.indexOf(interfaceStr) < 0)
        {
            classRecord.interfacesStrs.push(interfaceStr);
        }
    }

   public static addExtendToLast(extendStr:string):void{
        if (ClassList.isScanning == false) return;
        let classRecord:ClassRecord = ClassList.classList[ClassList.classList.length - 1];
        if (classRecord && extendStr )classRecord.extendsStr = extendStr;
    }

    public static showMembers():void{
        //if (ClassList.isScanning == false) return;
        if (ClassList.currentClassRecord)
        {
            let classRecord:ClassRecord = ClassList.currentClassRecord;
            console.log(classRecord.statics);
            console.log(classRecord.children);
        }
    }

    public static checkIsStatic(ident:string):ClassRecord
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let staticClass:ClassRecord = classRecord;
        do {
            let staticMember:Array<ClassMember>  = staticClass.statics;
            for (var i = 0; i < staticMember.length; i++) {
                let member:ClassMember = staticMember[i];
                if (member.identifier == ident)
                {
                    return staticClass;
                }

            }
        }while (staticClass = staticClass.extended)


        return null
    }

    public static checkIsClassMember(ident:string):ClassRecord
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let currentInheritClass:ClassRecord = classRecord;
        do {
            let children:Array<ClassMember>  = currentInheritClass.children;
            for (var i = 0; i < children.length; i++) {
                let member:ClassMember = children[i];
                if (member.identifier == ident)
                {
                    return currentInheritClass;
                }

            }
        }while (currentInheritClass = currentInheritClass.extended)


        return null
    }
    public static checkIdentIsSuperClassName(ident:string):boolean
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let currentInheritClass:ClassRecord = classRecord;
        while (currentInheritClass = currentInheritClass.extended) {
            if (currentInheritClass.className == ident) return true
        }
        return false
    }

    public static checkIsParentIdent(ident:string):boolean
    {
        if (ClassList.isScanning) return null;
        let classRecord:ClassRecord = ClassList.currentClassRecord;
        if (classRecord.extended && classRecord.extended.className == ident) return true;
        return false
    }

    public static checkIsStaticParentMamber(ident:string):ClassRecord
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let staticClass:ClassRecord = classRecord;
        while (staticClass = staticClass.extended)
        {
            let staticMember:Array<ClassMember>  = staticClass.statics;
            for (var i = 0; i < staticMember.length; i++) {
                let member:ClassMember = staticMember[i];
                if (member.identifier == ident)
                {
                    return staticClass;
                }

            }
        }


        return null
    }

    public static checkIsInheritedInterface(ident:string):boolean
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let currentInheritClass:ClassRecord = classRecord;
        do {
            let interfaces:Array<ClassRecord>  = currentInheritClass.interfaces;
            for (var i = 0; i < interfaces.length; i++) {
                let targetInterface:ClassRecord = interfaces[i];
                if (targetInterface.className == ident)
                {
                    return true;
                }

            }
        }while (currentInheritClass = currentInheritClass.extended)


        return false
    }

    public static checkIsInterface(interfaceStr:string):ClassRecord
    {
        if (ClassList.isScanning) return null;
        //TODO check duplicates
        //let classRecord:ClassRecord = ClassList.currentClassRecord;
        let classes = ClassList.classList;
        for (var i = 0; i < classes.length; i++) {
            let interfaceRecord:ClassRecord = classes[i];
            if (interfaceRecord.classKind == ClassKind.INTERFACE && interfaceRecord.className == interfaceStr) return interfaceRecord
        }

        return null
    }

    public static checkStaticThisOnCurrent(ident:string):ClassRecord
    {
        if (ClassList.isScanning) return null;

        let classRecord:ClassRecord = ClassList.currentClassRecord;
        let staticMember:Array<ClassMember>  = classRecord.statics;
        for (var i = 0; i < staticMember.length; i++) {
            let member:ClassMember = staticMember[i];
            if (member.identifier == ident)
            {
                return classRecord;
            }

        }


        return null
    }

   public  static optimize():void
    {
        let classes = ClassList.classList;
        for (var i = 0; i < classes.length; i++) {
            let classRecord:ClassRecord = <ClassRecord>classes[i];


            let extendStr:string = classRecord.extendsStr;
            if (extendStr && extendStr != "")
            {
                ClassList.visitExtends(classRecord);
            }
            if (classRecord.interfacesStrs.length > 0)
            {
                let interfacesStrs = classRecord.interfacesStrs;
                for (var j = 0; j < interfacesStrs.length; j++) {
                    let interfaceStr = interfacesStrs[j];
                    ClassList.visitInterfaces(classRecord, interfaceStr);
                }
            }

        }

        ClassList.isScanning = false;
        if ((VERBOSE_MASK & ReportFlags.EXT_AST_SHOW_ALL_INTERFACES) == ReportFlags.EXT_AST_SHOW_ALL_INTERFACES) {
            ClassList.showAllInterfaces()
        }
    }

    public static visitInterfaces(classRecord:ClassRecord, interfaceStr:string):void  //TODO combine visitInterface and visitExtends in a one loop
    {
 /*       let classes = ClassList.classList;
        let matchList:Array<ClassRecord> = [];
        let interfaceRecord:ClassRecord;
        loopInterface:
            for (var j = 0; j < classes.length; j++) {

                let targetRecord:ClassRecord = <ClassRecord>classes[j];
                if (targetRecord != classRecord)
                {

                    if (targetRecord.packageName == classRecord.packageName) //The same package is priority
                    {
                        if (targetRecord.className == interfaceStr)
                        {
                            interfaceRecord = targetRecord;
                            break loopInterface;
                        }
                    }
                    if (targetRecord.className == interfaceStr)
                    {
                        matchList.push(targetRecord);

                    }
                }

            }

        if (interfaceRecord == undefined)
        {
            if (matchList.length > 0)
            {
                let classRecordImports = classRecord.imports;
                //loopIports:
                for (var k = 0; k < matchList.length; k++) {
                    let matchedRecord:ClassRecord = matchList[k];
                    let fullPath:string = matchedRecord.getFullPath();

                    if (classRecordImports.indexOf(fullPath) >= 0)
                    {
                        interfaceRecord = matchedRecord;
                    }

                }
            }

        }*/
        let interfaceRecord:ClassRecord = ClassList.findInterfaceFromClass(classRecord, interfaceStr);

        if (interfaceRecord)
        {
            classRecord.interfaces.push(interfaceRecord);
            //console.log("==added '" + classRecord.getFullPath() + "  " + interfaceRecord.getFullPath());

        }
        else
        {
            //console.log("***********Warning. Class '" + classRecord.getFullPath() + "' implements unknown interface: " + classRecord.extendsStr);
        }
    }

    public static findInterfaceFromClass(classRecord:ClassRecord, interfaceStr:string):ClassRecord
    {
        let classes = ClassList.classList;
        let matchList:Array<ClassRecord> = [];
        let interfaceRecord:ClassRecord;
        loopInterface:
            for (var j = 0; j < classes.length; j++) {

                let targetRecord:ClassRecord = <ClassRecord>classes[j];
                if (targetRecord != classRecord)
                {

                    if (targetRecord.packageName == classRecord.packageName) //The same package is priority
                    {
                        if (targetRecord.className == interfaceStr)
                        {
                            interfaceRecord = targetRecord;
                            break loopInterface;
                        }
                    }
                    if (targetRecord.className == interfaceStr)
                    {
                        matchList.push(targetRecord);

                    }
                }

            }

        if (interfaceRecord == undefined)
        {
            if (matchList.length > 0)
            {
                let classRecordImports = classRecord.imports;
                //loopIports:
                for (var k = 0; k < matchList.length; k++) {
                    let matchedRecord:ClassRecord = matchList[k];
                    let fullPath:string = matchedRecord.getFullPath();

                    if (classRecordImports.indexOf(fullPath) >= 0)
                    {
                        interfaceRecord = matchedRecord;
                    }

                }
            }

        }

        return interfaceRecord;
    }

    public static visitExtends(classRecord:ClassRecord):void
    {
        let classes = ClassList.classList;
        let extendStr:string = classRecord.extendsStr;
        let matchList:Array<ClassRecord> = [];
        let extendsRecord:ClassRecord;
        loopExtend:
            for (var j = 0; j < classes.length; j++) {

                let targetRecord:ClassRecord = <ClassRecord>classes[j];
                if (targetRecord != classRecord)
                {

                    if (targetRecord.packageName == classRecord.packageName) //The same package is priority
                    {
                        if (targetRecord.className == extendStr)
                        {
                            extendsRecord = targetRecord;
                            break loopExtend;
                        }
                    }
                    if (targetRecord.className == extendStr)
                    {
                        matchList.push(targetRecord);

                    }
                }

            }

        if (extendsRecord == undefined)
        {
            if (matchList.length > 0)
            {
                let classRecordImports = classRecord.imports;
                //loopIports:
                for (var k = 0; k < matchList.length; k++) {
                    let matchedRecord:ClassRecord = matchList[k];
                    let fullPath:string = matchedRecord.getFullPath();

                    if (classRecordImports.indexOf(fullPath) >= 0)
                    {
                        extendsRecord = matchedRecord;
                        //console.log("found" + extendsRecord.getFullPath());
                    }

                }
            }

        }

        if (extendsRecord)
        {
            classRecord.extended = extendsRecord;
            //console.log("Extends : " + classRecord.getFullPath() + "; " + extendsRecord.getFullPath());
        }
        else
        {

            if ((VERBOSE_MASK & ReportFlags.EXT_AST_SHOW_ABSENTED_SUPERS) == ReportFlags.EXT_AST_SHOW_ABSENTED_SUPERS) {
                console.log("****Warning. Class '" + classRecord.getFullPath() + "' extends unknown class: " + classRecord.extendsStr);
            }
        }
    }

    public static showAllInterfaces():void{
        let classes = ClassList.classList;
        for (var i = 0; i < classes.length; i++) {
            let classRecord:ClassRecord = <ClassRecord>classes[i];
            if (classRecord.classKind == ClassKind.INTERFACE)
            {
                console.log(">>> Interface: " + classRecord.getFullPath());
            }

        }

    }

}


interface IModifierItem{
    [modifier:string]:number
}
export const enum ModifierKind {
    PUBLIC = 1,
    PROTECTED = 2,
    INTERNAL = 3,
    PRIVATE = 4
}

export const MODIFIERS:{[name:string]:number} = {
    [Keywords.PUBLIC]: ModifierKind.PUBLIC,
    [Keywords.PROTECTED]: ModifierKind.PROTECTED,
    [Keywords.INTERNAL]: ModifierKind.INTERNAL,
    [Keywords.PRIVATE]: ModifierKind.PRIVATE
};




export class ClassRecord
{
    public packageName      :string;
    public className        :string;
    public classKind        :number = ClassKind.CLASS;
    public extendsStr?      :string;
    public extended?        :ClassRecord;//will be defined in optimize method
    //public implemented?     :ClassRecord;
    public children         :Array<ClassMember> = [];
    public statics          :Array<ClassMember> = [];
    public interfaces       :Array<ClassRecord> = [];
    public interfacesStrs   :Array<string> = [];
    public imports?         :Array<string> = [];
    constructor(packageName:string, className:string){
        this.packageName = packageName;
        this.className = className;
    }

    public getFullPath():string
    {
       let path:string = this.packageName && this.packageName != "" ? this.packageName + "." + this.className : this.className;
       return path
    }

/*    public getRelativeFullPath(relativeTo:ClassRecord):string
    {
        let splitThis:Array<string> = this.packageName.split(".");
        let splitTarget:Array<string> = relativeTo.packageName.split(".");
    }*/

}

export interface ClassRecordSimple {
    packageName :string;
    className   :string;
}
export class ClassMember
{
    public identifier      :string;
    public kind            :number;
    public isStatic        :boolean;
    public nsModifier      :number;
    public isOverridden    :boolean = false;
    public type            :string; //classRecord or string
    constructor(identifier:string, kind:number = 0, type:string){
        this.identifier = identifier;
        this.kind = kind;
    }

    public toString = (): string =>{
        return 'ident :' + this.identifier + ", kind:" + this.kind + ", isStatic:" + this.isStatic + ", mod:" + this.nsModifier + ", överd:" + this.isOverridden + ", type:" + this.type;
    }

}

export const enum ClassKind {
    CLASS = 1,
    INTERFACE = 2
}
export const enum ClassMemberKind {
    UNKNOWN = 0,
    METHOD = 1,
    CONST = 2,
    VARIABLE = 3,
    GET = 4,
    SET = 5
}





export function optimizeAST():void {
    ClassList.optimize();
}

export function getUsedClasses():string {
    //let importsCont = ClassList.classList.join(";\n");
    let result:string = ""
    let importsCont = "";
    let valueCont = "";
    let classes = ClassList.classList;
    const VARIABLE_DELIM = ".";

    for (var i = 0; i < classes.length; i++) {


        let classRecord:ClassRecord = <ClassRecord>classes[i];
        if (classRecord.classKind == ClassKind.CLASS) {
            let packageStrSlashes: string = classRecord.packageName.split(".").join("/");
            let packageStrDelims: string = classRecord.packageName.split(".").join(VARIABLE_DELIM);
            let classPath: string = classRecord.packageName && classRecord.packageName != "" ? packageStrSlashes + "/" + classRecord.className : classRecord.className;
            let importStr: string = `import { ${classRecord.className} } from "./${classPath}";\n`;
            let classPathKey = classRecord.packageName && classRecord.packageName != "" ? packageStrDelims + VARIABLE_DELIM + classRecord.className : classRecord.className;
            //let varsStr:string = `\tpublic static ${variableStr}:any = ${classRecord.className};\n`;
            let varsStr: string = `\t\tLibrary.classList["${classPathKey}"] = ${classRecord.className};\n`;
            importsCont += importStr;
            valueCont += varsStr;
        }
    }
    result = importsCont;
    result += "\nexport default class Library {\n";
    //result += "\tpublic static classList:Array<any> = [];\n}\n";
    result += "\tpublic static classList:Array<any> = [];\n";
    result += "\tconstructor() {\n";
    result += valueCont;
    result += "\n}\n}";


    return result;
}
