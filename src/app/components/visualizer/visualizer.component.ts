import { Component, OnInit } from '@angular/core';
import { head, last } from 'lodash';
import { Bounds, Dims, Point } from 'src/app/models';

import * as d3 from 'd3';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit{

  private tileDims: Dims = {
    width: 0.25,
    height: 0.25
  }

  private grid: any[] = [
    {x:0,y:0,fill:'yellow'},
    {x:0.5,y:0,fill:'orange'},
    {x:0.5,y:0.5,fill:'red'},
    {x:0,y:0.5,fill:'blue'},
  ]

  private margin: Bounds = {top: 0, right: 0, bottom: 0, left: 0};

  private globalDims: Dims = {
    width: 600,
    height: 600,
  };

  private xScale;
  private yScale;

  private canvasDims: Dims;
  private canvas: any;
  private svg: any;

  constructor() { }

  ngOnInit(): void {
    this.setup()
    this.draw()
  }

  private setup(){
    this.margin = Object.entries(this.margin).reduce((prev:any,curr:any) => ({
      ...prev,[head(curr)]:Math.round(last(curr)*this.globalDims.width)
    }),{})
    this.canvasDims = {
      width: this.globalDims.width - this.margin.left - this.margin.right,
      height: this.globalDims.height - this.margin.top - this.margin.bottom
    }
    this.canvas = d3.select(".canvas")
    this.svg = this.canvas.append('svg')
      .attr('width',this.canvasDims.width)
      .attr('height',this.canvasDims.height)
      .style('background-color','white');
    this.xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvasDims.width])
    this.yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvasDims.height])
  }

  private draw(): void{
    this.update(this.grid);
    this.svg.on('click',({offsetX,offsetY})=>{
      let clickLocation: Point = {x:offsetX,y:offsetY};
      this.grid.push(this.grid.shift());
      this.update(this.grid,clickLocation);
    });
  }

  private update(grid,clickLocation = {x:0,y:0}): void{
    const tiles = this.svg.selectAll('rect')
      .data(grid)

    tiles.exit().remove();

    tiles.attr("width",this.xScale(this.tileDims.width))
      .attr("height",this.yScale(this.tileDims.height))

    tiles.enter()
      .append('rect')
      .attr("width",this.xScale(this.tileDims.width))
      .attr("height",this.yScale(this.tileDims.height))
      .attr('fill',d=>d.fill)
      .merge(tiles)
      .transition().duration(200)
        .attr('x',d=>this.xScale(d.x + this.tileDims.width / 2))
        .attr('y',d=>this.yScale(d.y + this.tileDims.height / 2))
  }

}
