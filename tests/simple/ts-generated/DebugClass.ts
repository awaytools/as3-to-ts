import { RrParticle } from "./RrParticle";

export class DebugClass
{
    public key;
	constructor(){
        var tParticle2:RrParticle;
        for  (var __$nflvKey  in this.tCell2.pParticles) {
			tParticle2 = <RrParticle> this.tCell2.pParticles[__$nflvKey];

			console.log(tParticle2);
        }
	}


}


