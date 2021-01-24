import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VisualizerComponent } from './components/visualizer/visualizer.component';
import { SandboxComponent } from './components/sandbox/sandbox.component';
import { CourseComponent } from './components/course/course.component';
import { DojoComponent } from './components/dojo/dojo.component';
import { TreeComponent } from './components/tree/tree.component';
import { SlashComponent } from './components/slash/slash.component';
import { RingsComponent } from './components/rings/rings.component';

@NgModule({
  declarations: [
    AppComponent,
    VisualizerComponent,
    SandboxComponent,
    CourseComponent,
    DojoComponent,
    TreeComponent,
    SlashComponent,
    RingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
