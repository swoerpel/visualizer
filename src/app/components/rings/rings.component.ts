import { Component, OnInit } from '@angular/core';
import { Dims } from 'src/app/models';
import textures from 'textures';
import * as d3 from 'd3';
import { head, last } from 'lodash';
import { RingDataService } from 'src/app/shared/ringdata.service';

@Component({
  selector: 'app-rings',
  templateUrl: './rings.component.html',
  styleUrls: ['./rings.component.scss']
})
export class RingsComponent implements OnInit {
  
  public svg: any;
  public stopPointGroup;
  public slashGroup;
  public xScale: any;
  public yScale: any;
  public rScale: any;
  public lineGenerator: any;

  public color = {
    background: 'white',
  }

  public canvas: Dims ={
    width: 1600,
    height: 800,
  }

  public data: any = [
    {x:0.55,y:0.5,ir:0.1,or:0.2,t:'lines-thin'},
    {x:0.45,y:0.5,ir:0.25,or:0.3,t:'lines-thick'},
    {x:0.5,y:0.5,ir:0.35,or:0.45,t:'lines-thick'},
    {x:1,y:1,ir:0.5,or:0.53,t:'lines-thick'},
    // {x:0.5,y:0.5,ir:0.35,or:1,t:'lines-thin'},
  ]

  public textures = {
    lines:{
      thin: textures.lines().lighter(),
      thick: textures.lines().heavier(),
    },
    sequence:new Array(this.data.length).fill(null).map((_,i)=>
      textures.circles().radius((i+1)*3)//.thicker((i+1)/2).radius(7)
    )
  }

  constructor(
    private ringDataService: RingDataService
  ) { }

  ngOnInit(): void {
    this.setup();

    let rings = this.ringDataService.generateRingRow()

    this.update(rings);
  }

  public update(data){
    const rings = this.svg.selectAll('circles')
      .data(data)
    rings.enter()
      .append('circle')
      .attr('r',d=>this.xScale(d.radius))
      .style("stroke-width",d=>this.xScale(d.strokeWidth))
      // .attr('r',d=>this.xScale((d.outerRadius - d.innerRadius)/2 + d.innerRadius))
      // .style("stroke-width",d=>this.xScale(d.outerRadius - d.innerRadius))
      .attr('cx',d=>this.xScale(d.x))
      .attr('cy',d=>this.yScale(d.y))
	    .style("fill", 'none')
	    .style("stroke", (d,i) => {
        // const params = d.t.split('-')
        // return this.textures[head(params)][last(params)].url()
        return this.textures.sequence[i%this.textures.sequence.length].url()
      });
  }

  public setup(){
    this.svg = d3.select('.canvas')
      .append("svg")
      .attr('width', this.canvas.width)
      .attr('height', this.canvas.height)
      .style('background-color',this.color.background);
    this.xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width]);
    this.yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height]);
    this.rScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height]);
    this.svg.call(this.textures.lines.thin);
    this.svg.call(this.textures.lines.thick);
    this.textures.sequence.forEach((t)=>this.svg.call(t));
  }

}
