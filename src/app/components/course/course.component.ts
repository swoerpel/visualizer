import { Component, OnInit } from '@angular/core';
import { Dims, Point } from 'src/app/models';
import { colorPalettes } from 'src/app/shared/colors';

import * as d3 from 'd3';
import * as chroma from 'chroma.ts';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  private canvasRef: any;
  private svg: any;
  private group: any;

  private data = [
    {name: 'chet', points: 300},
    {name: 'dave', points: 200},
    {name: 'chris',points: 500},
    {name: 'tom',  points: 150},
  ]

  private canvas: Dims = {
    width: 600,
    height: 600,
  };

  private rScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width/2])
  private xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width])
  private yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height])
  private colors: string[] = colorPalettes.find(p=>p.name === 'Greens')?.colors;
  private colorMachine = chroma.scale(this.colors);

  private center: Point = {
    x: this.xScale(0.5),
    y: this.yScale(0.5),
  }

  private arcPath = d3.arc()
      .innerRadius(this.rScale(0.25))
      .outerRadius(this.rScale(0.75))
  
  private pie = d3.pie().sort(null).value((d:any) => d.points)

  private prevValues = []

  constructor() { }

  ngOnInit(): void {
    this.setup();
    this.update(this.data);
    this.svg.on('click',({offsetX,offsetY})=>{
    // d3.interval(()=>{
      // this.data.pop()
      this.data[0].points += 100
      this.update(this.data);
    // },1000)
    });
  }

  private setup(){
    this.canvasRef = d3.select(".canvas")
    this.svg = this.canvasRef.append('svg')
      .attr('width',this.canvas.width)
      .attr('height',this.canvas.height)
      .style('background-color','black');
    this.group = this.svg.append('g')
      .attr('transform',`translate(${this.center.x},${this.center.y})`)
  }

  private update(data){
    const paths = this.group.selectAll('path')
      .data(this.pie(data));

    paths.exit()  
      .transition().duration(750)
      .attrTween('d',d => this.arcTweenExit(d,this.arcPath))
      .remove()

    paths.attr('d',this.arcPath)
      .transition().duration(750)
      .attrTween('d',(d,i) => this.arcTweenUpdate(d,i,this.arcPath))

    paths.enter()
      .append('path')
      .attr('fill',(_,i)=>this.colorMachine(i/(data.length - 1)).hex())
      .attr('stroke','black')
      .attr('stroke-width',10)
      .each((d,i) => this.updatePreviousValues(d,i,data))
      .transition().duration(750)
        .attrTween('d',d => this.arcTweenEnter(d,this.arcPath))
  }

  private updatePreviousValues(d,i,data){
    if(this.prevValues.length < data.length){
      this.prevValues.push(d)
    } else {
      this.prevValues[i] = d;
    }
  }

  private arcTweenEnter(d, arcPath){
    const interpolate = d3.interpolate(d.endAngle, d.startAngle)
    return function(t){
      d.startAngle = interpolate(t);
      return arcPath(d);
    }
  }

  private arcTweenExit(d, arcPath){
    const interpolate = d3.interpolate(d.startAngle, d.endAngle)
    return function(t){
      d.startAngle = interpolate(t);
      return arcPath(d);
    }
  }

  private arcTweenUpdate(d,i, arcPath){
    // interpolate between two objects
    const interpolate = d3.interpolate(this.prevValues[i], d);
    console.log(interpolate(0),interpolate(1))
    this.prevValues[i] = interpolate(1);
    return function(t){
      return arcPath(interpolate(t));
    }
  }

}

