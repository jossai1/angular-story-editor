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

  ex = this.doc.addNamespace("ex", "http://www.example.org#");
  dcterms = this.doc.addNamespace("dcterms", "http://purl.org/dc/terms/");
  foaf = this.doc.addNamespace("foaf", "http://xmlns.com/foaf/0.1/");

  url:string="";
  name:string="";
  location:string="";
  label:string="";
  title:string="";


  attributes:Array<Object> = [];
  
  //possible attributes that a user can select
  //attributes = {"location":0, "title":1,"label":2 };
  attributesArray: Array<attribute> = [{name:"attributes..",id:-1},{name:"location",id:0}, {name:"title",id:1},{name:"label",id:2} ];
  // attributes:any[] = [{"location":0}, {"title":1},{"label":2} ];
  // selectedOption:number = this.attributesArray[0].id;
  //just set it to smhting - doesnt show add titile to box 
  selectedOption:attribute = {name:"attributes..",id:-1};
  attributedSelected:boolean = false;
  inputArray: Array<Object> = [{name:"name",value:"",id:"0"},{name:"url",value:"",id:"1"}];

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

  getProvJSON() {
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

 getIndex(item:string,array:any[]):number{
 	let index = -1;
  	for (var i = 0; i < array.length; i++) {
  		if(array[i].name === item){
  			index = i;
  			//return index;
  		}
  	};
  	return index;
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
	  		this.inputArray.push({name:"title",value:"", id:this.generateUUID()});
	  		//remove from areay so users cant choose it 
	  		//remove title from list so they cant add it again
	  		this.removeAttributeFromList("title");
	  		
	  	} 
	  	//label attr 
	  	else if(attributeNum === 2) {
	  		//this.attributedSelected2 = true;
	  		this.inputArray.push({name:"label",value:"", id:this.generateUUID()});
	  		//remove label from list so they cant add it again
	  		this.removeAttributeFromList("label");
	  	} 
	  	//location attr 
	  	else if (attributeNum === 0) {
	  		//this.attributedSelected0 = true;
	  		this.inputArray.push({name:"location",value:"", id:this.generateUUID()});
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
	//only the input array seems to be recieving the changes from the input 
	//display what user has put in each field
	console.log(this.inputArray);
	let name = this.inputArray["0"].value;
	let url = this.inputArray["1"].value;
	//let title = this.inputArray["0"].Object.value;
	//error here --deal with case where user hasnt added extra field(S)

	//set 'thing' values in prov doc
	//clicking make thin makes a simple and small prov with a name,url and title
	//displays on consile.log
	this.doc.addNamespace(name, url);



	let titleIndex = this.getIndex("title",this.inputArray);
	let locationIndex = this.getIndex("location",this.inputArray);
	let labelIndex = this.getIndex("label",this.inputArray);

	let title;
	let location;
	let label;
	//-1 indicates that this attribute was not added
	if(titleIndex !== -1){
		 title = this.inputArray[this.getIndex("title",this.inputArray).toString()].value;
		//now lets set our attributess
		// if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
		// CHECK for which attributes a user has set
		// if set set them 
		 if (title !== "") {
			this.doc.entity(name+":"+ name, ["dcterms:title", title]);
		}
	}
	if(locationIndex !== -1){
		 location = this.inputArray[this.getIndex("location",this.inputArray).toString()].value;
		 if (location !== "") {
		 	//not sure of syntax for lcoation
		 	this.doc.entity(name+":"+ name,["prov:location", this.prov.ns.Location]);
			// this.doc.entity(name+":",["prov:location", this.prov.ns.Location, location]);
		}

	}
	if(labelIndex !== -1){
		 label = this.inputArray[this.getIndex("label",this.inputArray).toString()].value;
		 if (label !== "") {
			this.doc.entity(name+":"+ name,["prov:label", label]);
		}
	}
	
	// //now lets set our attributess
	// // if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
	// // CHECK for which attributes a user has set
	// // if set set them 
	// if (title !== "") {
	// 	this.doc.entity(name+":", ["dcterms:title", title]);
	// }
	//  // ["prov:type", this.prov.ns.Person, "foaf:givenName", "Derek",
 //  //      "foaf:mbox", "<mailto:derek@example.org>"]
	// if (location !== "") {
	// 	this.doc.entity(name+":",["prov:location", this.prov.ns.Location, location]);
	// }
	// if (label !== "") {
	// 	this.doc.entity(name+":",["prov:label", label]);
	// }
	
	console.log(this.getDoc());
	console.log(JSON.stringify(this.getProvJSON(), null, "  "));
	//console.log(JSON.stringify(this.getProvJSON(), null, "  "));
	// console.log(this.getProvJSON());
	
	
	//below is not displaying :/
	// console.log(this.title);
	// console.log(this.location);
	// console.log(this.url);
	// console.log(this.name);
	// console.log(this.label);
}

setValues(name:string) {
	if(name === "title"){
		this.title = name;
	}
	else if(name === "url"){
		this.url = name;
	}
	else if(name === "name"){
		this.name = name;
	}
	else if(name === "label"){
		this.label = name;
	}
	else {
		this.location = name;
	}


}


}
