import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { CourseComponent } from './components/course/course.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizerComponent,
    SandboxComponent,
    CourseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
