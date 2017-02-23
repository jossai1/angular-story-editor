import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryEditorComponent } from './story-editor/story-editor.component';
import { TestModelComponent } from './test-model/test-model.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { DragulaModule } from 'ng2-dragula';

// temp testing 
import { DragDropModule, DropdownModule, OverlayPanelModule, CalendarModule, AccordionModule, ConfirmDialogModule } from 'primeng/primeng';

import { MaterialModule } from '@angular/material';



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
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    DragulaModule,
    CalendarModule,
    ConfirmDialogModule,
    MaterialModule,
    OverlayPanelModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
