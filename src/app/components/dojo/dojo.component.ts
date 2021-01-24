import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Dims } from 'src/app/models';
import * as d3 from 'd3';
import { Activity, ActivityItem, ActivityService } from 'src/app/shared/activity.service';
import { tap } from 'rxjs/operators';



@Component({
  selector: 'app-dojo',
  templateUrl: './dojo.component.html',
  styleUrls: ['./dojo.component.scss'],

})
export class DojoComponent implements OnInit {

  public Activity = Activity;

  public selectedActivity: Activity = Activity.Cycling;

  public svg: any;

  public graph: any;

  public xScale: any;

  public yScale: any;

  public xAxisGroup: any;

  public yAxisGroup: any;

  public colorScale: any;

  public lineGenerator: any;

  public path: any;

  public margin = { top: 40, right: 20, bottom: 50, left: 100}

  public canvas: Dims ={
    width: 660 - this.margin.left - this.margin.right,
    height: 480 - this.margin.top - this.margin.bottom,
  }

  public colors: string[] = [
    'coral',
    'gold',
    'lightblue',
    'lightgreen',
  ]

  constructor(
    public activityService: ActivityService,
  ) { }

  ngOnInit(): void {
    this.setup();
    this.activityService.updateData$.pipe(
      tap(() => {
        const data = this.activityService.getActivityData(this.selectedActivity);
        this.update(data)
        })
    ).subscribe();
    this.activityService.updateData$.next();
  }

  public setup(){
    this.svg = d3.select('.canvas')
      .append("svg")
      .attr('width', this.canvas.width + this.margin.left + this.margin.right)
      .attr('height', this.canvas.height + this.margin.top + this.margin.bottom)
    this.graph = this.svg.append('g')
      .attr('width',this.canvas.width)
      .attr('height',this.canvas.height)
      .attr('transform',`translate(${this.margin.left},${this.margin.top})`)

    // domains are data dependant
    this.xScale = d3.scaleTime().range([0,this.canvas.width]);
    this.yScale = d3.scaleLinear().range([this.canvas.height,0])

    this.xAxisGroup = this.graph.append('g')
      .attr('class','x-axis')
      .attr('transform',`translate(${0},${this.canvas.height})`)

    this.yAxisGroup = this.graph.append('g')
      .attr('class','y-axis')

    this.lineGenerator = d3.line()
      .x((d: any) => this.xScale(new Date(d.date)))
      .y((d: any) => this.yScale(d.distance))

    this.path = this.graph.append('path')
    // this.colorScale = d3.scaleOrdinal(Object.keys(Activity),this.colors)
  }

  public update(data: ActivityItem[]){

    data.sort((a:any,b:any) => new Date(a.date).valueOf() - new Date(b.date).valueOf());

    const dateExtrema: Date[] = d3.extent(data, d=> new Date(d.date));
    this.xScale.domain(dateExtrema)
    const distanceExtrema: number[] = [0, d3.max(data, d=>d.distance)];
    this.yScale.domain(distanceExtrema)


    this.path.data([data])
      .attr('fill','none')
      .attr('stroke','#00bfa5')
      .attr('stroke-width',2)
      .attr('d',this.lineGenerator)


    // create circles for data objects
    const circles = this.graph.selectAll('circle')
      .data(data)

    circles.exit().remove()

    circles
      .attr('cx',d => this.xScale(new Date(d.date)))
      .attr('cy',d => this.yScale(d.distance))

    // add new points
    circles.enter()
      .append('circle')
      .attr('r',4)
      .attr('fill','#ccc')
      // .merge(circles)
      .attr('cx',d => this.xScale(new Date(d.date)))
      .attr('cy',d => this.yScale(d.distance))


    // create axis
    const xAxis = d3.axisBottom(this.xScale)
      .ticks(4)
      .tickFormat(d3.timeFormat('%b %d'));

    const yAxis = d3.axisLeft(this.yScale)
      .ticks(4)
      .tickFormat(d => `${d} m`)

    // call creates shapes based on AXIS
    this.xAxisGroup.call(xAxis);
    this.yAxisGroup.call(yAxis);

    // rotate axis text
    this.xAxisGroup.selectAll('text')
      .attr('transform','rotate(-40)')
      .attr('text-anchor','end')

    const lineGroup = this.graph.append('g')

    const xDottedLine = lineGroup.append('line')
      .attr('stroke','#ccc')
      .attr('stroke-dasharray',4)
      .attr('stroke-width',1)

    const yDottedLine = lineGroup.append('line')
      .attr('stroke','#ccc')
      .attr('stroke-dasharray',4)
      .attr('stroke-width',1)

    this.graph.selectAll('circle')
      .on('mouseover',(mouseEvent,d)=>{
        d3.select(mouseEvent.target)
          .transition().duration(50)
          .attr('r',8)
          .attr('stroke','white')
        lineGroup.attr('opacity',0.5)
        xDottedLine
          .attr('x1',this.xScale(new Date(d.date)))
          .attr('x2',this.xScale(new Date(d.date)))
          .attr('y1',this.canvas.height)
          .attr('y2',this.yScale(d.distance))
        yDottedLine
          .attr('x1',0)
          .attr('x2',this.xScale(new Date(d.date)))
          .attr('y1',this.yScale(d.distance))
          .attr('y2',this.yScale(d.distance))
      })
      .on('mouseleave',(mouseEvent,d)=>{
        d3.select(mouseEvent.target)
          .transition().duration(50)
          .attr('r',4)
          .attr('stroke','#ccc')
        lineGroup.attr('opacity',0)
      })
  }

  public selectActivity(activity: Activity){
    this.selectedActivity = activity;
    this.activityService.updateData$.next()
  }

}
