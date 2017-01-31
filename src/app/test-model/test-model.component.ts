import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-model',
  templateUrl: './test-model.component.html',
  styleUrls: ['./test-model.component.css']
})
export class TestModelComponent implements OnInit {

  constructor() { }

  prov:any = require('../../../provjs/prov');
  doc:any =  this.prov.document();
  amber:number = 0;
  ex = this.doc.addNamespace("ex", "http://www.example.org#");
  dcterms = this.doc.addNamespace("dcterms", "http://purl.org/dc/terms/");
  foaf = this.doc.addNamespace("foaf", "http://xmlns.com/foaf/0.1/");
  
  ngOnInit() {
  	console.log(this.doc);
  }

  setNameSpace(){
  	// Prefix declarations
  }

  addActor(){
  	this.doc.agent("ex:derek",
      ["prov:type", this.prov.ns.Person, "foaf:givenName", "Derek",
       "foaf:mbox", "<mailto:derek@example.org>"]);
  }

  addEvent(){
  	// Activities
    this.doc.activity("ex:compile1");
  	
  }

  addThing() { 
  	this.doc.entity("ex:article", ["dcterms:title", "Crime rises in cities"]);
  	
  }


  derivation(){
  	
  }

  getDoc(){
  	return this.doc.scope;
  }

  getProcJSON(){
  	return this.getDoc().getProvJSON();
  }
  export(){
  	console.log(this.getDoc());
  }


}
