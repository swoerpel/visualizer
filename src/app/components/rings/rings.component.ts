import { Component, OnInit } from '@angular/core';
import { Dims } from 'src/app/models';
import textures from 'textures';
import * as d3 from 'd3';
import { head, last } from 'lodash';
import { FunctionType, RingDataService } from 'src/app/shared/ringdata.service';
import { saveSvgAsPng } from 'save-svg-as-png';
import { makeid } from 'src/app/shared/helpers';
import { Ring } from 'src/app/shared/models';


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
    background: 'white',
  }

  public canvas: Dims ={
    width: 2400,
    height: 1200,
  }

  constructor(
    private ringDataService: RingDataService
  ) { }

  ngOnInit(): void {
    this.setup();

    let staticRowParams = {
      ringCount:12,
      xStart: 0,
      yStart:0.25,
      rStart: 1/12,
      swStart: 1/12,
      curve:{
        magnitude: 0.25,
        frequency: 1,
        offset: 0,
      },
      texture:{
        groups: 1,
      }
    }
    let dynamicRowParams = {
      rChange: 0,
      swChange: 0,
    }
    let ringRow: Ring[] = this.ringDataService.generateRingRow(
      staticRowParams,
      dynamicRowParams,
    )
    let r = this.svg.append('g');
    this.drawRingRow(ringRow,r);

    staticRowParams = {
      ...staticRowParams,
      xStart:0.25,
      yStart:0.75,
    }
    dynamicRowParams = {
      ...dynamicRowParams,
      rChange: 0.75
    }
    ringRow = this.ringDataService.generateRingRow(
      staticRowParams,
      dynamicRowParams,
    )
    r = this.svg.append('g');
    this.drawRingRow(ringRow,r);

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
	    .style("fill", 'none')
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
