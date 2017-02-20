import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryEditorComponent } from './story-editor/story-editor.component';
import { TestModelComponent } from './test-model/test-model.component';
import { AccordionModule } from 'primeng/primeng';

import { DragulaModule } from 'ng2-dragula';

// temp testing 
import { DragDropModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { WelcomeComponent } from './welcome/welcome.component';
import { ConfirmDialogModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    AppComponent,
    StoryEditorComponent,
    TestModelComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AccordionModule,
    DragDropModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DragulaModule,
    CalendarModule,
    ConfirmDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
