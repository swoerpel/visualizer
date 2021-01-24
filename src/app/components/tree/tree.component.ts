import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  private data_hierarchy = {
    name: 'mario',
    children:[
      {
        name: 'yoshi'
      },
      {
        name:'toad',
        children: [
          {
            name: 'bowser'
          }
        ]
      }
    ]
  }
 
  private data_stratify = [
    {name: 'mario'},
    {name: 'yoshi', parent: 'mario'},
    {name: 'toad', parent: 'mario'},
    {name: 'bowser', parent: 'toad'}
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
