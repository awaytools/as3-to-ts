/**
 * Created by Ushan on 30.06.2017.
 */

import { MovieClip } from "../flash/display/MovieClip";

export class DynamicTypesObjectNMovies
{
	constructor(){
		var myObject:any = {}
		myObject.a = 10;
		console.log(myObject.a);

		var myMovie:MovieClip = new MovieClip();
		myMovie.a = 10;
		console.log(myMovie.a);
	}
}

