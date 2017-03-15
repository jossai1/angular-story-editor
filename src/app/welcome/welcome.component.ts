import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor() { }

  Shepherd:any = require('../../../node_modules/tether-shepherd/dist/js/shepherd');
  tour:any;
  ngOnInit() {
 
	this.tour = new this.Shepherd.Tour({
	  defaults: {
	    classes: 'shepherd-theme-arrows',
	    scrollTo: true
	  }
	});

	this.tour.addStep('example-step', {
	  text: 'Click to go to the Story Editor',
	  attachTo: '.create-story bottom',
	  buttons: [
	    
	  ]
	});

	this.tour.start();


  }


  cancelTour()
  {
  	this.tour.cancel();
  }

}
