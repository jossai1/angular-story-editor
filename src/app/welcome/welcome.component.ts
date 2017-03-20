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
	    scrollTo: true,
      showCancelLink:true
	  }
	});

  this.tour.addStep('dbclick', {
    text: 'Let"s Get Started! Click to go to the Story Editor <br> <img src="../../assets/images/welcome.gif" alt="welcome" style="width:500px;height:228px;">',
    attachTo: '.btn right',
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
