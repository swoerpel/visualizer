import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { saveSvgAsPng } from 'save-svg-as-png';
import { Dims } from 'src/app/models';
import { makeid } from 'src/app/shared/helpers';
import { Ring } from 'src/app/shared/models';
import { RingParamService } from 'src/app/shared/ring-param.service';
import { RingDataService } from 'src/app/shared/ringdata.service';


@Component({
  selector: 'app-rings',
  templateUrl: './rings.component.html',
  styleUrls: ['./rings.component.scss']
})
export class RingsComponent implements OnInit {
  
  public svg: any;
  public xScale: any;
  public yScale: any;
  public rScale: any;

  public color = {
    background: 'black',
  }

  public canvas: Dims ={
    width: 2400,
    height: 1200,
  }

  constructor(
    private ringDataService: RingDataService,
    private ringParamService: RingParamService,
  ) { }

  ngOnInit(): void {
    this.setup();

    let rowInputs = [
      {
        row: {yStart:0},
        dynamic: {rChange:0.1},
      },
      {
        row: {yStart:0.25},
        texture: {reverse:false},
        dynamic: {swChange:0.3},
      },
      {
        row: {yStart:0.5},
        dynamic: {rChange:0.2},
      },
      {
        row: {yStart:0.75},
        texture: {reverse:false},
        dynamic: {swChange:0.3},
      },
      {
        row: {yStart:1},
        dynamic: {rChange:0.1},
      },
    ]

    let rowParams = this.ringParamService.generateParams(rowInputs);
    rowParams.forEach((params)=>{
      let ringRow: Ring[] = this.ringDataService.generateRingRow(params);
      let r = this.svg.append('g');
      this.drawRingRow(ringRow,r);
    })

  }

  public drawRingRow(ringRow: Ring[],container){
    const rings = container.selectAll('circles')
      .data(ringRow)
    rings.enter()
      .append('circle')
      .attr('cx',d=>this.xScale(d.x))
      .attr('cy',d=>this.yScale(d.y))
      .attr('r',d=>this.rScale(d.radius))
      .style("stroke-width",d=>this.rScale(d.strokeWidth))
	    .style("fill", d=>d.fillColor)
	    .style("stroke", (d,i) => {
        this.svg.call(d.textureFunction);
        return d.textureFunction.url();
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
  }

  public saveSvg(){
    let svg = document.getElementsByTagName("svg")[0];
    console.log('svg',svg)
    let id = `${makeid()}.png`;
    let params = {scale: 1, backgroundColor: "#FFFFFF"};
    saveSvgAsPng(svg,id,params);
  }

}
