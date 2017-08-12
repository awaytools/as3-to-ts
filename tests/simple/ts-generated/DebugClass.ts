import { classBound } from "./ClassBound";

import { Sprite } from "@as3web/flash"
import {RNG} from "./shared/utilities/RNG";
/**
 * http://www.faqs.org/rfcs/rfc1321.html
 */

@classBound
export class DebugClass extends Sprite
{
    public pRNG:RNG;
    constructor(){
		super();

    }

}



