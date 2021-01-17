import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import * as chroma from 'chroma.ts';

import { Dims, Point } from 'src/app/models';
import { colorPalettes } from 'src/app/shared/colors';
import { saveSvgAsPng } from 'save-svg-as-png';
import { makeid } from 'src/app/shared/helpers';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss']
})
export class SandboxComponent implements OnInit {

  private ringCount = 24;
  private innerRadius = 0.1;
  private outerRadius = 0.9;
  private step = (this.outerRadius - this.innerRadius) / this.ringCount;
  private rings = new Array(this.ringCount).fill(null).map((_,i)=>({
    innerRadius: this.innerRadius + (i * this.step),
    outerRadius: this.innerRadius + ((i+1) * this.step),
    data: new Array(i+1).fill(1)
  }))

  // private rings = [
  //   // {
  //   //   innerRadius: 0.6,
  //   //   outerRadius: 0.8,
  //   //   data: [1,1]
  //   // },
  //   {
  //     innerRadius: 0.6,
  //     outerRadius: 0.4,
  //     data: [1,1,1]
  //   },
  //   {
  //     innerRadius: 0.4,
  //     outerRadius: 0.2,
  //     data: [1,1,1,1]
  //   },
   
  // ]

  private canvasRef: any;
  private canvas: Dims = {
    width: 4800,
    height: 4800,
  };
  private center: Point = {
    x: this.canvas.width / 2,
    y: this.canvas.height / 2
  }

  private rScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width / 2])

  private colors: string[] = colorPalettes.find(p=>p.name === 'RdBu')?.colors;

  private svg: any;
  private colorMachine: any;

  private groups: any[];

  private index: number = 0;

  private pause = false;

  constructor() { }

  ngOnInit(): void {
    this.setup()
    this.updateRings(this.rings)
    this.svg.on('click',({offsetX,offsetY})=>{
          // this.pause = !this.pause
        this.updateRings(this.rings) 
    });
    // d3.interval(()=>{
      // if(!this.pause){
        // this.updateRings(this.rings)
      // }
    // },200)
    d3.select("#download")
    .on('click', function(){
        // Get the d3js SVG element and save using saveSvgAsPng.js
        // saveSvgAsPng(document.getElementsByTagName("svg")[0], `${makeid()}.png`, {scale: 2, backgroundColor: "#FFFFFF"});
    })
  }

  saveImg(){

  }

  updateRings(rings){
    rings.forEach((ring, i)=>{
      this.update(ring, this.groups[i])
      // ring.data[this.index%ring.data.length]+=1
    });
    // this.index++;
  }

  private setup(){
    this.colorMachine = chroma.scale(this.colors)
    this.canvasRef = d3.select(".canvas")
    this.svg = this.canvasRef.append('svg')
      .attr('width',this.canvas.width)
      .attr('height',this.canvas.height)
      .style('background-color','black');
    this.groups = new Array(this.rings.length).fill(null).map((_) => 
      this.svg.append('g').attr('transform',`translate(${this.center.x},${this.center.y})`)
    );
  }

  private update(ring, group): void{
    group.exit().remove();
    const arcPath = d3.arc()
      .outerRadius(this.rScale(ring.outerRadius))
      .innerRadius(this.rScale(ring.innerRadius));
    const pie = d3.pie().sort(null)//.value((d:any) => d.value)
    const paths = group.selectAll('path').data(pie(ring.data as any))

    paths.enter()
      .append('path')
      .attr('class','arc')      
      .merge(paths)
      // .transition().duration(400)

      .attr('d',(d:any)=>arcPath(d))
      .attr('fill',(_,i)=>this.colorMachine(i/(ring.data.length-1)))
      .attr('stroke','black')
      .attr('stroke-width',20)

  }
  

}
