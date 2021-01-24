import { Injectable } from '@angular/core';
import textures from 'textures';
import { Ring, Texture, TextureFunction } from './models';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class RingDataService {

  constructor() { }

  public generateRingRow(staticParams, dynamicParams): Ring[]{

    const xOffset = (i:number) => {
      return i / (staticParams.ringCount - 1)
    }

    const yOffset = (i:number) => {
      const curve = staticParams.curve;
      const step = 2 * Math.PI * (1 / (staticParams.ringCount - 1))
      const offset = (curve.offset / curve.frequency);
      let angle = i * step + offset;
      return curve.magnitude * 0.5 * Math.sin(angle * curve.frequency);
    }

    const rOffset = (i:number) => {
      const rMax = 0.5;
      const scaler = d3.scaleLinear()
        .domain([0,1])
        .range([staticParams.rStart,rMax])
      const step = scaler(dynamicParams.rChange) - staticParams.rStart
      return i * step / staticParams.ringCount;
    }

    const swOffset = (i:number) => {
      const swMax = 0.2;
      const scaler = d3.scaleLinear()
        .domain([0,1])
        .range([staticParams.swStart,swMax]);
      const step = (scaler(dynamicParams.swChange) - staticParams.swStart);
      return i * step / staticParams.ringCount;
    }

    const textureFunction = (i:number, compliment = true) => {
      const groupSize = Math.floor(staticParams.ringCount / staticParams.texture.groups)
      const minWeight = 0.8;
      const maxWeight = compliment ? 2.4 : 4;
      const scaleWeight = d3.scaleLinear()
        .domain([0,groupSize])
        .range([minWeight,maxWeight])
      const t = textures.circles()
        .heavier(scaleWeight(i % groupSize))
      return compliment ? t.complement() : t;
    }

    return new Array(staticParams.ringCount).fill(null).map((_,i)=>{
      return {
        x: staticParams.xStart + xOffset(i),
        y: staticParams.yStart + yOffset(i),
        radius: staticParams.rStart + rOffset(i),
        strokeWidth: staticParams.swStart + swOffset(i),
        textureFunction: textureFunction(i),
      }
    })
  }

}
