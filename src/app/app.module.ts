import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoryEditorComponent } from './story-editor/story-editor.component';
import { WelcomeComponent } from './welcome/welcome.component';

// temp testing 
import { DragDropModule, MessagesModule, DropdownModule, OverlayPanelModule, CalendarModule, AccordionModule, ConfirmDialogModule } from 'primeng/primeng';
import { MaterialModule } from '@angular/material';




@NgModule({
  declarations: [
    AppComponent,
    StoryEditorComponent,
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
    CalendarModule,
    ConfirmDialogModule,
    MaterialModule,
    OverlayPanelModule,
    DropdownModule,
    MessagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
