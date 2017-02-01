import { Component, OnInit,SimpleChange} from '@angular/core';

interface attribute {
  name: string,
  id:number
}

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
  url:string="";
  name:string="";
  location:string="";
  label:string="";
  titile:string="";
  attributes:Array<Object> = [];
  
  //possible attributes that a user can select
  //attributes = {"location":0, "title":1,"label":2 };
  attributesArray: Array<attribute> = [{name:"attributes..",id:-1},{name:"location",id:0}, {name:"title",id:1},{name:"label",id:2} ];
  // attributes:any[] = [{"location":0}, {"title":1},{"label":2} ];
  // selectedOption:number = this.attributesArray[0].id;
  //just set it to smhting - doesnt show add titile to box 
  selectedOption:attribute = {name:"attributes..",id:-1};
  attributedSelected:boolean = false;
  inputArray: Array<Object> = [{name:"name",id:"0"},{name:"url",id:"1"}];

  ngOnInit() {
  	console.log(this.doc);
  	// console.log(this.attributes.location);
  	// console.log(this.attributes.title);
  	// console.log(this.attributes.label);
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

  getDoc() {
  	return this.doc.scope;
  }

  getProcJSON() {
  	return this.getDoc().getProvJSON();
  }


  export() {
  	console.log(this.getDoc());
  }

  removeAttributeFromList(item:string) {

  	for (var i = 0; i < this.attributesArray.length; i++) {
  		if(this.attributesArray[i].name === item){
  			this.attributesArray.splice( i, 1 );
  		}
  	};

  }

 generateUUID() {
    var d = new Date().getTime();
    if(window.performance && typeof window.performance.now === "function"){
        d += performance.now();; //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};
	
	//adds an <input> given by id to the fieldset 
	// adds an attribute that the user selcted from the drop down
	addClickedAttr(attributeNum:number) {
  	//this.attributedSelected= false;
  	console.log(attributeNum);

  	//only allowed to have max 3 extra attributes 
  	//stop adding stop adding more atributes
  	if(this.inputArray.length <= 4 ) {
  			// title attr 
	  	if(attributeNum === 1) {
	  		//this.attributedSelected = true;
	  		//ensure no dupes use salt id
	  		// so each input can be uniquely identified
	  		this.inputArray.push({name:"title", id:this.generateUUID()});
	  		//remove from areay so users cant choose it 
	  		//remove title from list so they cant add it again
	  		this.removeAttributeFromList("title");
	  		
	  	} 
	  	//label attr 
	  	else if(attributeNum === 2) {
	  		//this.attributedSelected2 = true;
	  		this.inputArray.push({name:"label", id:this.generateUUID()});
	  		//remove label from list so they cant add it again
	  		this.removeAttributeFromList("label");
	  	} 
	  	//location attr 
	  	else if (attributeNum === 0) {
	  		//this.attributedSelected0 = true;
	  		this.inputArray.push({name:"location", id:this.generateUUID()});
	  		//remove location from list so they cant add it again
	  		this.removeAttributeFromList("location");
	  	}

		else {
	  		//case were it's -1 so do nothing 
	  		//this is because the selectedoption by default is set to  -1 to allow a title for drop down 
	  	}
  }

 	else {
  	alert("Reached max number of attributes that can be added!");
  }
  	
}

makeThing() {

}


}
