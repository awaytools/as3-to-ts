import { TestVO } from "./TestVO";
/**
 * Created by Ushan on 15.06.2017.
 */




export class LoopTests
{
	//----------------------------------------------------------------------
	//	public fields
	//----------------------------------------------------------------------
	public tests:TestVO[] = new Array<TestVO>([]);

	//----------------------------------------------------------------------
	//	private fields
	//----------------------------------------------------------------------

	//----------------------------------------------------------------------
	//
	//	constructor
	//
	//----------------------------------------------------------------------
	constructor(){

		this.test1ForeachComplex();
		this.test1ForeachComplex_Order();
		this.test2ForeachVector();
		this.test2ForeachVector_Order();
		this.test3ForeachArray();
		this.test3ForeachArray_Order();
		this.test4ForeachObject();
		this.test4ForeachObject_Order();
		this.test5ForClassic();
		this.test5ForClassic_Order();
		this.test6ForCComplexCondition();
		this.test6ForCComplexCondition_Order();
		this.test7WhileClassic();
		this.test7WhileClassic_Order();
		this.test8WhileSpecChars_Order();
		this.test9NestedWileDo_Order();
		this.testOffArrayForInDiscontinuous();
		this.testOffObjectForIn_Order();
		for (var i:number = 0; i < this.tests.length; i++)
		{
			var testVO:TestVO = this.tests[i];
			console.log(testVO.caption + "\t\t", testVO.isValid + "\t\t", " expected:" + testVO.expected, " result:" + testVO.result, testVO.ref);

		}

	}

	public test1ForeachComplex():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/Preloader.as#L96-L101";
		var Managers:any = {};
		Managers.pUser = {};
		Managers.pUser.pLanguages = {};
		Managers.pUser.pLanguages.a = 1;
		Managers.pUser.pLanguages.b = 2;
		Managers.pUser.pLanguages.c = 3;
		Managers.pUser.pLanguages.d = 4;

		var sum:number = 0;

		for  (var __$nflvKey  in Managers.pUser.pLanguages)
		{
			var tLang:string = undefined[__$nflvKey];

			sum += parseInt(tLang)
		}
		var testVO:TestVO = new TestVO(this.test1ForeachComplex, "test1ForeachNoOrderComplex", ref, 10, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test1ForeachComplex_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/Preloader.as#L96-L101";
		var Managers:any = {};
		Managers.pUser = {};
		Managers.pUser.pLanguages = {};
		Managers.pUser.pLanguages.a = "1";
		Managers.pUser.pLanguages.b = "2";
		Managers.pUser.pLanguages.c = "3";
		Managers.pUser.pLanguages.d = "4";


		var sum:string = ""

		for  (var __$nflvKey  in Managers.pUser.pLanguages)
		{
			var tLang:string = undefined[__$nflvKey];

			sum += tLang
		}

		var testVO:TestVO = new TestVO(this.test1ForeachComplex_Order, "test1ForeachComplex_Order", ref, "3142", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}




	public test2ForeachVector():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L172";
		var pSelectedResource:any[] = [new Array<number>([1,2,3,4])]
		var tVector:number[] = pSelectedResource[0] as number[]
		var sum:number = 0;
		for  (var __$nflvKey  in tVector)
		{
			var tL:number = tVector[__$nflvKey];

			sum+=tL;
		}
		var testVO:TestVO = new TestVO(this.test2ForeachVector, "test2ForeachVector", ref, 10, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test2ForeachVector_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L172";
		var pSelectedResource:any[] = [new Array<string>(["1","2","3","4"])]
		var tVector:string[] = pSelectedResource[0] as string[]
		var sum:string = "";
		for  (var __$nflvKey  in tVector)
		{
			var tL:string = tVector[__$nflvKey];

			sum+=tL;
		}
		var testVO:TestVO = new TestVO(this.test2ForeachVector_Order, "test2ForeachVector_Order", ref, "1234", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test3ForeachArray():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L231";
		var pCurrentSelection:any[] = [1,2,3,4];
		var tPath:number[] = []
		var i:number;
		var sum:number = 0;
		for  (var __$nflvKey  in pCurrentSelection)
		{
			i = pCurrentSelection[__$nflvKey];

			tPath.push(i)
			sum += i;
		}
		var testVO:TestVO = new TestVO(this.test3ForeachArray, "test3ForeachArray", ref, 10, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test3ForeachArray_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L231";
		var pCurrentSelection:any[] = ["1","2","3","4"];
		var tPath:number[] = []
		var i:number;
		var sum:string = "";
		for  (var __$nflvKey  in pCurrentSelection)
		{
			i = pCurrentSelection[__$nflvKey];

			tPath.push(i)
			sum += String(i);
		}
		var testVO:TestVO = new TestVO(this.test3ForeachArray_Order, "test3ForeachArray_Order", ref, "1234", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test4ForeachObject():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L609-L611";
		var pButtonWidths:any = {}
		pButtonWidths.a = 1;
		pButtonWidths.b = 2;
		pButtonWidths.c = 3;
		pButtonWidths.d = 4;
		var sum:number = 0;
		for  (var __$nflvKey  in pButtonWidths)
		{
			var tW:number = pButtonWidths[__$nflvKey];

			sum += pButtonWidths[tW];

		}
		var testVO:TestVO = new TestVO(this.test4ForeachObject, "test4ForeachObject", ref, 10, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test4ForeachObject_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L609-L611";
		var pButtonWidths:any = {}
		pButtonWidths.a = 1;
		pButtonWidths.b = 2;
		pButtonWidths.c = 3;
		pButtonWidths.d = 4;
		var sum:string = "";
		for  (var __$nflvKey  in pButtonWidths)
		{
			var tW:number = pButtonWidths[__$nflvKey];

			sum += String(tW);

		}
		var testVO:TestVO = new TestVO(this.test4ForeachObject_Order, "test4ForeachObject_Order", ref, "3142", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test5ForClassic():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/RNGTester.as#L12-L14";
		var sum:number = 0;
		for (var i:number = 1; i < 4; i++) {
			sum += i
		}
		var testVO:TestVO = new TestVO(this.test5ForClassic, "test5ForClassic", ref, 6, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test5ForClassic_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/RNGTester.as#L12-L14";
		var sum:string = "";
		for (var i:number = 1; i < 4; i++) {
			sum += String(i)
		}
		var testVO:TestVO = new TestVO(this.test5ForClassic_Order, "test5ForClassic_Order", ref, "123", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public static staticVar1:number = 1;
	public test6ForCComplexCondition():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L790-L792";
		var i:number
		var Managers:any = {};
		Managers.pUser = {};
		Managers.pUser.pUserRole = 1;
		var sum:number = 0;
		for (i = 0; i < (Managers.pUser.pUserRole == LoopTests.staticVar1 ? 2 : 1); i++)
		{
			sum += i
		}
		var testVO:TestVO = new TestVO(this.test6ForCComplexCondition, "test6ForCComplexCondition", ref, 1, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test6ForCComplexCondition_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L790-L792";
		var i:number
		var Managers:any = {};
		Managers.pUser = {};
		Managers.pUser.pUserRole = 1;
		var sum:string = "";
		for (i = 0; i < (Managers.pUser.pUserRole == LoopTests.staticVar1 ? 2 : 1); i++)
		{
			sum += String(i)
		}
		var testVO:TestVO = new TestVO(this.test6ForCComplexCondition_Order, "test6ForCComplexCondition_Order", ref, "01", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}
	/*
	 public function test7ForXML():Boolean
	 {

	 }*/
	public test7WhileClassic():boolean
	{
		var ref:string = "--";
		var sum:number = 0;
		var pRecentActivities:any[] = [1,2,3,4,5,6];
		var pMaxRecentActivities:number = 4;
		while (pRecentActivities.length > pMaxRecentActivities)
		{

			sum +=pRecentActivities.pop();
		}
		var testVO:TestVO = new TestVO(this.test7WhileClassic, "test7WhileClassic", ref, 11, sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test7WhileClassic_Order():boolean
	{
		var ref:string = "--";
		var sum:string = "";
		var pRecentActivities:any[] = [1,2,3,4,5,6];
		var pMaxRecentActivities:number = 4;
		while (pRecentActivities.length > pMaxRecentActivities)
		{

			sum +=String(pRecentActivities.pop());
		}
		var testVO:TestVO = new TestVO(this.test7WhileClassic_Order, "test7WhileClassic_Order", ref, "65", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}


	public test8WhileSpecChars_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/MenuBar.as#L1456-1459"
		var tTxt:string = "line1\n\nline2\n\nline3\n\nline4"
		while (tTxt.indexOf("\n\n") >= 0)
		{
			tTxt = tTxt.split("\n\n").join("\n")
		}
		var testVO:TestVO = new TestVO(this.test8WhileSpecChars_Order, "test8WhileSpecChars_Order", ref, "line1\nline2\nline3\nline4", tTxt);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test8WhileWithFunc_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/tree/master/tests/full-as3/srcMain/main/resource/Re.as#L315-L317"
		var pResourceRoot:any = {}
		var tSection:number = 5;
		var pLastRePositionSection:number = 3;
		pResourceRoot.fGetRePosition = function(value:number):string
		{
			return ""
		}
		var sum:string = ""
		while (pResourceRoot.fGetRePosition(tSection) == "" && tSection > pLastRePositionSection) {
			sum += String(tSection--)

		}
		var testVO:TestVO = new TestVO(this.test8WhileWithFunc_Order, "test8WhileWithFunc_Order", ref, "54", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public test9NestedWileDo_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/blob/master/tests/full-as3/srcMain/shared/particles/Solute.as#L194-L228"
		var i:number = 1;
		var k:number = 8;
		var sum:string = ""
		while (k > 5)
		{
			do
			{
				i++
				sum += (String(i) + "-" + String(k) + ";")
			} while (i < 5)
			k--

		}
		var testVO:TestVO = new TestVO(this.test9NestedWileDo_Order, "test9NestedWileDo_Order", ref, "2-8;3-8;4-8;5-8;6-7;7-6;", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}


	public testOffArrayForInDiscontinuous():boolean
	{
		var ref:string = "--";
		var arr:any[] = [];
		arr[1] = 2;
		arr[3] = 5;
		arr[5] = 7;
		var sum:string = "";
		var key:number;
for  (key  in arr)
		{
			sum += String(arr[key]);
		}
		var testVO:TestVO = new TestVO(this.testOffArrayForInDiscontinuous, "testOffArrayForInDiscontinuous", ref, "257", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}

	public testOffObjectForIn_Order():boolean
	{
		var ref:string = "https://github.com/awaystudios/sunflower-ts/blob/master/tests/full-as3/srcMain/shared/MovieManager.as#L302-L304";
		var obj:any = {};

		obj.a = 2;
		obj.b = 5;
		obj.c = 7;
		obj.c = 8;
		var sum:string = "";
		var key:string;
for  (key  in obj)
		{
			sum += String(obj[key]);
		}
		var testVO:TestVO = new TestVO(this.testOffObjectForIn_Order, "testOffObjectForIn_Order", ref, "825", sum);
		this.tests.push(testVO);
		return testVO.isValid
	}
	//----------------------------------------------------------------------
	//
	//	private methods
	//
	//----------------------------------------------------------------------


}


class TestVO
{
	public get func()		:Function {return this._func }
	private _func				:Function;

	public get caption()	:string {   return this._caption }
	private _caption			:string;

	public get ref()		:string {   return this._ref }
	private _ref				:string;

	public get expected()	:any {   return this._expected }
	private _expected			:any;


	public get result()	:any {return this._result }
	private _result				:any;

	public get isValid()	:boolean {   return this._isValid }
	private _isValid			:boolean;

	public order

	constructor(func:Function, caption:string, ref:string, expected:any, result:any){
		this._func = func;
		this._caption = caption;
		this._ref = ref;
		this._expected = expected;
		this._result = result;
		this._isValid = expected === result;
	}
}
    

