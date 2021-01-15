import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as chroma from 'chroma.ts';

import { Dims, Point } from 'src/app/models';
import { colorPalettes } from 'src/app/shared/colors';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {
  private data = [
    {value: 1},
    {value: 1},
  ];

  private canvasRef: any;
  private canvas: Dims = {
    width: 600,
    height: 600,
  };
  private radius: number = 200;
  private center: Point = {
    x: this.canvas.width / 2,
    y: this.canvas.height / 2
  }

  private colors: string[] = colorPalettes.find(p=>p.name === 'Spectral')?.colors;

  private svg: any;
  private colorMachine: any;

  private group;

  constructor() { }

  ngOnInit(): void {
    this.setup()
    this.update(this.data);
    this.svg.on('click',({offsetX,offsetY})=>{
      this.data.push({value: 1})
      this.update(this.data);
    });
  }

  private setup(){
    this.colorMachine = chroma.scale(this.colors)
    this.canvasRef = d3.select(".canvas")
    this.svg = this.canvasRef.append('svg')
      .attr('width',this.canvas.width)
      .attr('height',this.canvas.height)
      .style('background-color','black');
    this.group = this.svg.append('g')
      .attr('transform',`translate(${this.center.x},${this.center.y})`)
  }

  private update(data): void{
    const arcPath = d3.arc()
      .outerRadius(this.radius * 1.75)
      .innerRadius(this.radius / 2);
    const pie = d3.pie()
      .sort(null)
      .value((d:any) => d.value)
    const paths = this.group.selectAll('path')
      .data(pie(data as any))
    paths.enter()
      .append('path')
      .attr('class','arc')
      .merge(paths)
      .attr('d',(d:any)=>arcPath(d))
      .attr('fill',(_,i)=>this.colorMachine(i/(data.length-1)))
      .attr('stroke','black')
      .attr('stroke-width',5)
  }

}
