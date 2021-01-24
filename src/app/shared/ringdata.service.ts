import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RingDataService {

  constructor() { }

  public generateRingRow(){
    const ringCount = 12;
    return new Array(ringCount).fill(null).map((_,i)=>{
      console.log(i/ringCount + 1/(2*ringCount))
      return {
        x:i/ringCount + 1/(2*ringCount),
        y:0.5,
        innerRadius: .2,
        outerRadius: .25,
        radius: 0.1,
        strokeWidth: 0.025,
      }
    })
  }


}
