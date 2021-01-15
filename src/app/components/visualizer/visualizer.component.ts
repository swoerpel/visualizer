import { Component, OnInit } from '@angular/core';
import { head, last } from 'lodash';

import * as d3 from 'd3';
import * as chroma from 'chroma.ts';
import { colorPalettes } from 'src/app/shared/colors';
import { Dims, Point } from 'src/app/models';

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['./visualizer.component.scss']
})
export class VisualizerComponent implements OnInit{

  private canvas: Dims = {
    width: 600,
    height: 600,
  };

  private gridDims: Dims = {
    width: 8,
    height: 8,
  }

  private tileWidth = this.canvas.width / this.gridDims.width;
  private tileHeight = this.canvas.height / this.gridDims.height;

  private colors: string[] = colorPalettes.find(p=>p.name === 'Spectral')?.colors;

  private grid: any[] = [];

  private canvasRef: any;
  private svg: any;
  private colorMachine: any;

  private xScale;
  private yScale;

  constructor() { }

  ngOnInit(): void {
    this.setup()
    this.update(this.grid);
    this.svg.on('click',({offsetX,offsetY})=>{
      let clickLocation: Point = {x:offsetX,y:offsetY};
      this.grid.push(this.grid.shift());
      this.update(this.grid,clickLocation);
    });
  }

  private setup(){
    this.colorMachine = chroma.scale(this.colors)
    let index = 0;
    for(let i = 0; i < this.gridDims.width; i++){
      let col = []
      for(let j = 0; j < this.gridDims.height; j++){
        col.push({
          x: i / this.gridDims.width,
          y: j / this.gridDims.height,
          fill: this.colorMachine((index % this.gridDims.width) /this.gridDims.width),
        })
        index++;
      }
      if(i % 2 === 0){ 
        col = col.reverse() 
      }

      this.grid = [...this.grid,...col]
    }
    this.canvasRef = d3.select(".canvas")
    this.svg = this.canvasRef.append('svg')
      .attr('width',this.canvas.width)
      .attr('height',this.canvas.height)
      .style('background-color','white');
    this.xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width])
    this.yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height])
  }

  private update(grid, clickLocation = {x:0,y:0}): void{
    if(false){ 
      let indexA = Math.floor(Math.random() * this.gridDims.width)
      let indexB = Math.floor(Math.random() * this.gridDims.width)
      const temp = {...grid[indexA]};
      grid[indexA] = {...grid[indexB]};
      grid[indexB] = temp;
    }
    const tiles = this.svg.selectAll('rect')
      .data(grid)

    tiles.exit().remove();

    tiles.attr("width",this.tileWidth)
      .attr("height",this.tileHeight)

    tiles.enter()
      .append('rect')
      .attr("width",this.tileWidth)
      .attr("height",this.tileHeight)
      .attr('fill',d=>d.fill)
      // merges enter selection and rects in the dom already
      // lines below are applied to both
      .merge(tiles) 
      .transition().duration(1000)
        .attr('x',d=>this.xScale(d.x))
        .attr('y',d=>this.yScale(d.y))
  }

}
