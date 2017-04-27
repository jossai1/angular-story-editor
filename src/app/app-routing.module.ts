import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoryEditorComponent }   from './story-editor/story-editor.component';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'story-editor',  component: StoryEditorComponent },
  { path: 'welcome',  component: WelcomeComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/