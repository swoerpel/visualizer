import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum Activity {
  Cycling,
  Running,
  Swimming,
  Walking,
}

export interface ActivityItem{
  distance: number;
  activity: Activity;
  date: string;
}

@Injectable({
  providedIn: 'root'
})

export class ActivityService {


  public updateData$: Subject<void> = new Subject();

  private data: ActivityItem[] = [
    ...new Array(5).fill(null).map(()=>this.getRandomActivityItem(Activity.Cycling)),
    ...new Array(5).fill(null).map(()=>this.getRandomActivityItem(Activity.Walking)),
    ...new Array(5).fill(null).map(()=>this.getRandomActivityItem(Activity.Running)),
    ...new Array(5).fill(null).map(()=>this.getRandomActivityItem(Activity.Swimming)),
    // {distance: 1000,activity:Activity.Cycling,date: new Date(y,m,3).toString()},
    // {distance: 1500,activity:Activity.Walking,date: new Date(y,m,5).toString()},
    // {distance: 2000,activity:Activity.Swimming,date: new Date(y,m,6).toString()},
    // {distance: 1100,activity:Activity.Cycling,date: new Date(y,m,11).toString()},
    // {distance: 1200,activity:Activity.Cycling,date: new Date(y,m,7).toString()},
    // {distance: 1800,activity:Activity.Cycling,date: new Date(y,m,13).toString()},
    // {distance: 1300,activity:Activity.Cycling,date: new Date(y,m,10).toString()},
  ];  

  constructor() { }

  public getActivityData(activity: Activity = Activity.Cycling): ActivityItem[]{
    return this.data.filter((a: ActivityItem) => a.activity === activity);
  }

  public updateData(){
    this.updateData$.next();
  }

  public deleteData(){
    this.data.splice(Math.floor(Math.random()*this.data.length), 1);
    this.updateData$.next();

  }

  public addData(){
    this.data.push(this.getRandomActivityItem())
    this.updateData$.next();
  }

  private getRandomActivityItem(activity: Activity = null): ActivityItem{
    let y = 2020;
    let m = 11;
    if(activity === null){
      activity = Activity[Object.keys(Activity)[Math.floor(Math.random() * Object.keys(Activity).length)]];
    }
    return {
      distance: Math.floor((Math.random() * 1600) * 100) / 100 + 200,
      date: new Date(y,m,Math.floor(Math.random() * 28)).toString(),
      activity,
    }
  }

}
