import { Injectable } from '@angular/core';
import textures from 'textures';
import { Ring, TextureFunction } from './models';
import * as d3 from 'd3';
import * as chroma from 'chroma.ts';
import { colorPalettes } from './colors';

@Injectable({
  providedIn: 'root'
})
export class RingDataService {
  
  private colors: string[] = colorPalettes.find(p=>p.name === 'Spectral')?.colors;
  private colorMachine = chroma.scale(this.colors);
  constructor() { }

  public generateRingRow({row,curve,texture,dynamic}): Ring[]{
    const xOffset = (i:number) => {
      return i / (row.ringCount - 1)
    }

    const yOffset = (i:number) => {
      const step = 2 * Math.PI * (1 / (row.ringCount - 1))
      const offset = (curve.offset / curve.frequency);
      let angle = i * step + offset;
      return curve.magnitude * 0.5 * Math.sin(angle * curve.frequency);
    }

    const rOffset = (i:number) => {
      const rMax = 0.5;
      const scaler = d3.scaleLinear()
        .domain([0,1])
        .range([row.rStart,rMax]);
      const step = scaler(dynamic.rChange) - row.rStart;
      return i * step / row.ringCount;
    }

    const swOffset = (i:number) => {
      const swMax = 0.2;
      const scaler = d3.scaleLinear()
        .domain([0,1])
        .range([row.swStart,swMax]);
      const step = (scaler(dynamic.swChange) - row.swStart);
      return i * step / row.ringCount;
    }

    const textureFunction = (i:number, compliment = true): TextureFunction => {
      const groupSize = Math.floor(row.ringCount / texture.groups)
      const minWeight = 0.8;
      const maxWeight = compliment ? 2.4 : 4;
      const scaleWeight = d3.scaleLinear()
        .domain(texture.reverse ? [groupSize,0] : [0,groupSize])
        .range([minWeight,maxWeight]);
      const t = textures.circles()
        .heavier(scaleWeight(i % groupSize))
        .fill(this.colorMachine((i % row.ringCount) / row.ringCount).hex())
      return compliment ? t.complement() : t;
    }

    const fillColor = (i:number) => {
      return 'none';//this.colorMachine((i % row.ringCount) / row.ringCount).hex()
    }

    return new Array(row.ringCount).fill(null).map((_,i) => {
      return {
        x: row.xStart + xOffset(i),
        y: row.yStart + yOffset(i),
        radius: row.rStart + rOffset(i),
        strokeWidth: row.swStart + swOffset(i),
        textureFunction: textureFunction(i),
        fillColor: fillColor(i),
      }
    })
  }

}
