import { Component, OnInit } from '@angular/core';
import { Dims, Point } from 'src/app/models';
import * as d3 from 'd3';
import textures from 'textures';

@Component({
  selector: 'app-slash',
  templateUrl: './slash.component.html',
  styleUrls: ['./slash.component.scss']
})
export class SlashComponent implements OnInit {
  


  
  public svg: any;
  public stopPointGroup;
  public slashGroup;
  public xScale: any;
  public yScale: any;
  public lineGenerator: any;

  public color = {
    background: 'white',
  }

  public canvas: Dims ={
    width: 800,
    height: 800,
  }

  public path: number[] = [];

  public stopPoints: Point[] = [
    {x:0.2,y:0.5},
    {x:0.8,y:0.5},
  ]

  public slashes = [
    0,1
    // {
    //   stopIndexStart: 0,
    //   stopIndexEnd: 1,
    // }
  ]

  constructor() { }

  ngOnInit(): void {
    this.setup();
    this.updateStopPoints(this.stopPoints);
    // this.updateSlashes(this.slashes,this.stopPoints);
  }
  


  public setup(){
    this.svg = d3.select('.canvas')
      .append("svg")
      .attr('width', this.canvas.width)
      .attr('height', this.canvas.height)
      .style('background-color',this.color.background);
    this.xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width]);
    this.yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height]);
    this.stopPointGroup = this.svg.append('g')
    this.slashGroup = this.svg.append('g')
    // this.lineGenerator = d3.line()
    //   .x(d=> this.xScale(d))
    //   .y(d=> this.yScale())
  }

  public updateSlashes(slashes: any[], stopPoints: Point[]){


    let lc: any = d3.line()
      // .curve(d3[curve])
      .x((d:any) => this.xScale(d.x))
      .y((d:any) => this.yScale(d.y))

    // const slashGroup = this.slashGroup.selectAll('path')
    //   .data(slashes)

    this.svg.append('path')
      .attr('fill','white')
      .attr('stroke','white')
      .attr('stroke-width',2)
      .attr('d',d => lc())


    // slashGroup.enter()
    //   .append('path')
    //   .attr('fill','red')
    //   .attr('stroke','white')
    //   .attr('stroke-width',20)
    //   .attr('d',(d:number)=> {
    //     console.log("d",d)
    //     let p: Point = stopPoints[d];
    //     console.log("p",lc([p]))
    //     return lc([p])
    //   })
  }

  public updateStopPoints(stopPoints: Point[]){
    // const circles = this.stopPointGroup.selectAll('circle')
    //   .data(stopPoints)
    // circles.exit().remove();

    // circles.enter()
    //   .append('circle')


    // var svg = d3.select("#example")
    //   .append("svg");
    
    console.log("textures",textures)
    var t = textures.lines()
      .heavier()
      .thicker();
    
    this.svg.call(t);

    this.svg.append("circle")
      .attr('r',this.xScale(0.25))
      .attr('cx',this.xScale(0.5))
      .attr('cy',this.yScale(0.5))
	    .style("fill", 'none')
	    .style("stroke-width", 80)
	    .style("stroke", t.url());
  }

}
