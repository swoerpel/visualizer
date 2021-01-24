import { Component, OnInit } from '@angular/core';
import { Dims, Point } from 'src/app/models';
import { colorPalettes } from 'src/app/shared/colors';

import * as d3 from 'd3';
import * as chroma from 'chroma.ts';
import * as Tone from 'tone'

import { makeid } from 'src/app/shared/helpers';
import { forkJoin, of, Subject } from 'rxjs';
import { concatMap, delay, first, map, tap } from 'rxjs/operators';
import { MidiService } from 'src/app/midi.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {

  private canvasRef: any;
  private svg: any;
  private group: any;

  private update$: Subject<string> = new Subject();

  private data = [
    // {id: makeid(), points: 300, fillColor: '#FFFFFF'},
    // {id: makeid(), points: 200, fillColor: '#FFFFFF'},
    // {id: makeid(),points: 500, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
    // {id: makeid(),  points: 150, fillColor: '#FFFFFF'},
  ]

  private canvas: Dims = {
    width: 600,
    height: 600,
  };

  private rScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width/2])
  private xScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.width])
  private yScale = d3.scaleLinear().domain([0,1]).range([0,this.canvas.height])
  private colors: string[] = colorPalettes.find(p=>p.name === 'Spectral')?.colors;
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

  constructor(
    private midiService: MidiService,
  ) { }

  ngOnInit(): void {
    this.setup();
    this.update(this.data);
    this.update$.pipe(
      tap((id: string) => {
        this.data = this.data.filter(d=> d.id !== id)
        this.update(this.data)
      })
    ).subscribe();
    // this.svg.on('click',({offsetX,offsetY})=>{
    // d3.interval(()=>{
      // this.data.pop()
      // this.data[0].points += 100
      // this.update(this.data);
    // },1000)
    // });
  }

  public startAudio(){
    this.midiService.loadMidi().pipe(
      first(),
      map((midi)=>midi.tracks[0].notes),
      map((notes)=>{
        let startTime = notes[0].time
        notes = notes.map((n)=>({
          time: n.time - startTime,
          note: n.name,
          velocity: n.velocity
        }))
        const synth = new Tone.Synth().toDestination();
        const part = new Tone.Part(((time, value) => {
          synth.triggerAttackRelease(value.note, "8n", time, value.velocity);
          this.data.push({id: makeid(), points: value.time, fillColor: this.colorMachine(Math.random()).hex()})
          
          this.update(this.data)
          // if(this.data.length > 5){
            // this.data.shift()
          // }
        }), notes)
        part.start(0);
        Tone.Transport.start();
      })
    ).subscribe();
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
    // data = data.map((d,i)=>({...d,fillColor: this.colorMachine(i/(data.length - 1)).hex()}))

    const paths = this.group.selectAll('path')
      .data(this.pie(data));

    paths.exit()  
      .transition().duration(0)
      .attrTween('d',d => this.arcTweenExit(d,this.arcPath))
      .remove()

    paths.attr('d',this.arcPath)
      .transition().duration(0)
      .attrTween('d',(d,i) => this.arcTweenUpdate(d,i,this.arcPath))

    paths.enter()
      .append('path')
      .attr('fill',d => d.data.fillColor)
      .attr('stroke','white')
      .attr('stroke-width',10)
      .each((d,i) => this.updatePreviousValues(d,i,data))
      .transition().duration(0)
        .attrTween('d',d => this.arcTweenEnter(d,this.arcPath))

    this.group.selectAll('path')
      .on('mouseover',(mouseEvent,d) => {
        d3.select(mouseEvent.target)
          // named transition here prevent conflicts
          // with other transitions on the same element
          .transition('changeSliceFill').duration(100)
          .attr('fill','white')
          // .attr('stroke','white');
      })
      .on('mouseout',(mouseEvent,d) => {
        d3.select(mouseEvent.target)
          .transition('changeSliceFill').duration(100)
          .attr('fill',d.data.fillColor)
          // .attr('stroke','black');
      })
      .on('click',(mouseEvent,d) => {
        this.update$.next(d.data.id)
      })
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
    this.prevValues[i] = interpolate(1);
    return function(t){
      return arcPath(interpolate(t));
    }
  }


}


