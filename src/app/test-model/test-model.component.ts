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
  attributesArray: Array<attribute> = [{name:"attributes..",id:-1},{name:"location",id:0}, {name:"title",id:1},{name:"label",id:2},{name:"type",id:3} ];
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


  //using it for a 'thing's attribute array
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
	
	//adds an <input> given by id to the fieldset of a thing 
	// or adds an attribute that the user selcted from the drop down
 addClickedAttr(attributeNum:number) {
  	//this.attributedSelected= false;
  	console.log(attributeNum);

  	//only allowed to have max 3 extra attributes 
  	//stop adding stop adding more atributes
  	if(this.inputArray.length <= 5 ) {
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
	  	//location attr 
	  	else if (attributeNum === 3) {
	  		//this.attributedSelected0 = true;
	  		this.inputArray.push({name:"type",value:"", id:this.generateUUID()});
	  		//remove location from list so they cant add it again
	  		this.removeAttributeFromList("type");
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

//takes the data from the field of a thing and makes an entuty and disolays it
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
	//set the name and url of the enetity 
	this.doc.addNamespace(name, url);

	//set any attributes the user has added 
	
	let titleIndex:number = this.getIndex("title",this.inputArray);
	let locationIndex:number = this.getIndex("location",this.inputArray);
	let labelIndex:number = this.getIndex("label",this.inputArray);
	let typeIndex:number = this.getIndex("type",this.inputArray);

	let title:string;
	let location:string;
	let label:string;
	let type:string;
	//keep a ref to entity so we can update its attributes
	var entity  = this.doc.entity(name+":"+ name);

	// //testing something
	// let isTitleSet:boolean = false;
	// let isLocationSet:boolean = false;
	// let isLabelSet:boolean = false;

	
	// if(titleIndex !== -1) {
	// 	//set the title to the user's input
	// 	 title = this.inputArray[this.getIndex("title",this.inputArray).toString()].value;
		 
	// 	if (title !== "") {
	// 		//this.doc.entity(name+":"+ name, ["dcterms:title", title]);
	// 		isTitleSet = true;
	// 	}
	// }
	// if(locationIndex !== -1){
	// 	//set the location to the user's input
	// 	 location = this.inputArray[this.getIndex("location",this.inputArray).toString()].value;
	// 	 if (location !== "") {
	// 	 	//not sure of syntax for lcoation
	// 	 	//this.doc.entity(name+":"+ name,["prov:location", this.prov.ns.Location]);
	// 	 	isLocationSet = true;
	// 		// not working this.doc.entity(name+":",["prov:location", this.prov.ns.Location, location]);
	// 	}

	// }
	// if(labelIndex !== -1){
	// 	//set the label to the user's input
	// 	 label = this.inputArray[this.getIndex("label",this.inputArray).toString()].value;
	// 	 if (label !== "") {
	// 		//this.doc.entity(name+":"+ name,["prov:label", label]);
	// 		isLabelSet = true;
	// 	}
	// }


	// //set local name + attributes at creation 
	// // if a location,title or label is set i.e not an empty string then we set the attribute value else we set it to undefined
	// // hard code test this.doc.entity("ex:article", ["dcterms:title", "Crime rises in cities", "prov:location",location, "prov:label", label] );
	// // wrong format this.doc.entity(name+":"+ name, (isTitleSet === true) ? ["dcterms:title", title] : undefined, (isLocationSet === true) ? ["prov:location", this.prov.ns.Location] : undefined, (isLabelSet === true) ? ["prov:label", label] : undefined);
	
	// //sets as expected but provenance doesnt like the undefined/null
	// this.doc.entity(name+":"+ name, ["dcterms:title", (isTitleSet === true) ? title: undefined, "prov:location", (isLocationSet === true) ? location : undefined, "prov:label", (isLabelSet === true) ? label : undefined]);




	//-1 indicates that this attribute was not added to the element
	//now lets set our attributess
	// if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
	// CHECK for which attributes a user has set
	// if set set them
	
	if(titleIndex !== -1){
		//set the title to the user's input
		 title = this.inputArray[this.getIndex("title",this.inputArray).toString()].value;
		 
		if (title !== "") {
			//this.doc.entity(name+":"+ name, ["dcterms:title", title]);
			entity.attr("dcterms:title", [title]);
		}
	}
	if(locationIndex !== -1){
		//set the location to the user's input
		 location = this.inputArray[this.getIndex("location",this.inputArray).toString()].value;
		 if (location !== "") {
		 	//this.doc.entity(name+":"+ name,["prov:location", location]);
			entity.attr("prov:location", [location]);
		}

	}
	if(labelIndex !== -1){
		//set the label to the user's input
		 label = this.inputArray[this.getIndex("label",this.inputArray).toString()].value;
		 if (label !== "") {
			//this.doc.entity(name+":"+ name,["prov:label", label]);
			entity.attr("prov:label", [label]);
		}
	}

	if(typeIndex !== -1){

		//todo: have a drop down box for users to select a prov type
		// *** or they can click 'other' and define thir own -- will go for this option (custom type) and drag and drop 
		// these will be two diff use cases 
		// this is just for now till we implement the drag and drop 
		// but we will still need the box their if they want to have thier own custom type 
		// maybe give them the drop down and drag and drop option and in both cases they can create thier own custom types
		// hard code type to Person for now till we decide // let user type in a type for now - has to be on of the inbuilt prov types
		
		// //set the type to the user's input
		 type = this.inputArray[this.getIndex("type",this.inputArray).toString()].value;
		 if (type !== "") {
			entity.attr(this.prov.ns.qn("type"), this.prov.ns.qn(type));

		}
	}
	
	
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
