import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryEditorComponent } from './story-editor/story-editor.component';
import { TestModelComponent } from './test-model/test-model.component';
import { AccordionModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    StoryEditorComponent,
    TestModelComponent
  ],
  imports: [
    BrowserModule,
    AccordionModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
