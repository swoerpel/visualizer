import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RingParamService {

  constructor() { }

  public generateParams(inputs){

    const row = {
      ringCount:12,
      xStart: 0,
      yStart:0.5,
      rStart: 1/12,
      swStart: 1/12,
    }

    const curve = {
      magnitude: 0.2,
      frequency: 1,
      offset: 0,
    }

    const texture = {
      groups: 1,
      reverse: true,
    }

    const dynamic = {
      rChange: 0,
      swChange: 0,
    }

    return inputs.map((rowInput) => {
      return {
        row: {...row,...rowInput?.row},
        curve: {...curve, ...rowInput?.curve},
        texture: {...texture, ...rowInput?.texture},
        dynamic: {...dynamic, ...rowInput?.dynamic},
      }
    })
  }
}
