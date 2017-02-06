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

  //a list that represents every element on the canvas 
  //grows dynamically 
  elementsOnCanvas:Array<Object> = [
  	{id:"0",src:"http://transparenciaong.info/images/document_icon.png",type:"thing",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0}, {name:"Title",id:1},{name:"Label",id:2},{name:"Type",id:3}]},
  	{id:"1",src:"http://affinityallianceco.com.au/wp-content/uploads/2015/06/events-icon-orange-.jpg",type:"event",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Start Time",id:3},{name:"End Time",id:4}]},
  	{id:"2",src:"http://www.egton.net/files/2016/07/Healthcare-Service-desk-icon-250-x-250-1.png",type:"actor",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Given name",id:3},{name:"E-mail",id:4}]}
  ];
  
  //possible attributes that a user can select
  attributesArray: Array<attribute> = [{name:"attributes..",id:-1},{name:"location",id:0}, {name:"title",id:1},{name:"label",id:2},{name:"type",id:3} ];

  //just set it to smhting - doesnt show add titile to box 
  selectedOption:attribute = {name:"attributes..",id:-1};

  //no  longer in use 
  attributedSelected:boolean = false;

  //an array of all the text boxes in a fieldset 
  // users add more inputs by selecting from a list of atributes - used for a single thing for now 
  inputArray: Array<Object> = [{name:"name",value:"",id:"0"},{name:"url",value:"",id:"1"}];

  ngOnInit() {
  	//test to see if doc is loaded 
  	console.log(this.doc);

  }

  setNameSpace(){
  	// Prefix declarations
  }

  // adds an actor to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addActor() {

  	this.elementsOnCanvas.push({id:this.generateUUID(),src:"http://www.egton.net/files/2016/07/Healthcare-Service-desk-icon-250-x-250-1.png",type:"actor",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Given name",id:3},{name:"E-mail",id:4}]});

  }

   // adds an event  to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addEvent() {

  	this.elementsOnCanvas.push({id:this.generateUUID(),src:"http://affinityallianceco.com.au/wp-content/uploads/2015/06/events-icon-orange-.jpg",type:"event",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Start Time",id:3},{name:"End Time",id:4}]});
  	
  }

  // adds a thing to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addThing() { 
  	
  	this.elementsOnCanvas.push({id:this.generateUUID(),src:"http://transparenciaong.info/images/document_icon.png",type:"thing",inputArray:[{name:"Name",value:"",id:"0"},{name:"URL",value:"",id:"1"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0}, {name:"Title",id:1},{name:"Label",id:2},{name:"Type",id:3}]});

  }

  //deletes the elemnt with the given id from the canvas 
  // by deleteing it from the list of elementsOnTheCanvas
  deleteElement(eleId:string) {

  	for (var i = 0; i < this.elementsOnCanvas.length; i++) {
  		if(this.elementsOnCanvas[i.toString()].id === eleId) {
  			this.elementsOnCanvas.splice( i, 1 );
  		}
  	};

  }

  derivation(){
  	
  }

  getDoc() {
  	return this.doc.scope;
  }

  getProvJSON() {
  	return this.getDoc().getProvJSON();
  }


  // determine which type of element was clicked - so we can send it to appropriate method 
  // each element has diff types and numbers of attributes 
  // so we need to split this out into their own methods 
  processEleAttribute(selectedAttrId, eleType, inputArray, attributeArray) {

  	// type thing
  	if(eleType === "thing") {

  		this.addClickedAttToThingInput(selectedAttrId,inputArray,attributeArray);
  	}

  	// type actor
  	else if (eleType === "actor") {
  		this.addClickedAttToActorInput(selectedAttrId,inputArray,attributeArray);
  	}
	
	// type event 
	else { 
		this.addClickedAttToEventInput(selectedAttrId,inputArray,attributeArray);
	}  	

  }

  //add attribute to a thing
  addClickedAttToThingInput(selectedAttrId:number, inputArray, attributeArray) {

  	console.log(selectedAttrId);

  	//only allowed to have max 3 extra attributes 
  	//stop adding stop adding more atributes
  	if(inputArray.length <= 5 ) {
  			
	  	//location attr 
	  	if (selectedAttrId === 0) {
	  		//this.attributedSelected0 = true;
	  		inputArray.push({name:"Location",value:"", id:this.generateUUID()});
	  		//remove location from list so they cant add it again
	  		this.removeAttributeFromList("Location",attributeArray);
	  	}
	  	// title attr 
	  	else if(selectedAttrId === 1) {
	  
	  		//ensure no dupes use salt id
	  		// so each input can be uniquely identified
	  		inputArray.push({name:"Title",value:"", id:this.generateUUID()});
	  		//remove from areay so users cant choose it 
	  		//remove title from list so they cant add it again
	  		this.removeAttributeFromList("Title",attributeArray);
	  	}

	  	//label attr 
	  	else if(selectedAttrId === 2) {
	  		
	  		inputArray.push({name:"Label",value:"", id:this.generateUUID()});
	  		//remove label from list so they cant add it again
	  		this.removeAttributeFromList("Label",attributeArray);
	  	} 

	  	//type attr 
	  	else if (selectedAttrId === 3) {
	  		
	  		inputArray.push({name:"Type",value:"", id:this.generateUUID()});
	  		//remove type from list so they cant add it again
	  		this.removeAttributeFromList("Type",attributeArray);
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

   //add attribute to a actor
  addClickedAttToActorInput(selectedAttrId:number, inputArray, attributeArray) {
  	
  	console.log(selectedAttrId);

  	//only allowed to have max 5 extra attributes 
  	//stop adding stop adding more atributes
  	if(inputArray.length <= 6 ) {
  			
	  	//location attr 
	  	if (selectedAttrId === 0) {
	  		//this.attributedSelected0 = true;
	  		inputArray.push({name:"Location",value:"", id:this.generateUUID()});
	  		//remove location from list so they cant add it again
	  		this.removeAttributeFromList("Location",attributeArray);
	  	}
	  	// label attr 
	  	else if(selectedAttrId === 1) {
	  
	  		//ensure no dupes use salt id
	  		// so each input can be uniquely identified
	  		inputArray.push({name:"Label",value:"", id:this.generateUUID()});
	  		//remove from areay so users cant choose it 
	  		//remove title from list so they cant add it again
	  		this.removeAttributeFromList("Label",attributeArray);
	  	}

	  	//type attr 
	  	else if(selectedAttrId === 2) {
	  		
	  		inputArray.push({name:"Type",value:"", id:this.generateUUID()});
	  		//remove label from list so they cant add it again
	  		this.removeAttributeFromList("Type",attributeArray);
	  	} 

	  	//given name attr 
	  	else if (selectedAttrId === 3) {
	  		
	  		inputArray.push({name:"Given Name",value:"", id:this.generateUUID()});
	  		//remove type from list so they cant add it again
	  		this.removeAttributeFromList("Given Name",attributeArray);
	  	}

	  	//email attr 
	  	else if (selectedAttrId === 4) {
	  		
	  		inputArray.push({name:"E-mail",value:"", id:this.generateUUID()});
	  		//remove type from list so they cant add it again
	  		this.removeAttributeFromList("E-mail",attributeArray);
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

   //add attribute to a event
  addClickedAttToEventInput(selectedAttrId:number, inputArray, attributeArray) {
  	
  	console.log(selectedAttrId);

  	//only allowed to have max 5 extra attributes 
  	//stop adding stop adding more atributes
  	if(inputArray.length <= 6 ) {
  			
	  	//location attr 
	  	if (selectedAttrId === 0) {
	  		//this.attributedSelected0 = true;
	  		inputArray.push({name:"Location",value:"", id:this.generateUUID()});
	  		//remove location from list so they cant add it again
	  		this.removeAttributeFromList("Location",attributeArray);
	  	}
	  	// label attr 
	  	else if(selectedAttrId === 1) {
	  
	  		//ensure no dupes use salt id
	  		// so each input can be uniquely identified
	  		inputArray.push({name:"Label",value:"", id:this.generateUUID()});
	  		//remove from areay so users cant choose it 
	  		//remove title from list so they cant add it again
	  		this.removeAttributeFromList("Label",attributeArray);
	  	}

	  	//type attr 
	  	else if(selectedAttrId === 2) {
	  		
	  		inputArray.push({name:"Type",value:"", id:this.generateUUID()});
	  		//remove label from list so they cant add it again
	  		this.removeAttributeFromList("Type",attributeArray);
	  	} 

	  	//start time attr 
	  	else if (selectedAttrId === 3) {
	  		
	  		inputArray.push({name:"Start Time",value:"", id:this.generateUUID()});
	  		//remove type from list so they cant add it again
	  		this.removeAttributeFromList("Start Time",attributeArray);
	  	}

	  	//end time attr 
	  	else if (selectedAttrId === 4) {
	  		
	  		inputArray.push({name:"End Time",value:"", id:this.generateUUID()});
	  		//remove type from list so they cant add it again
	  		this.removeAttributeFromList("End Time",attributeArray);
	  	}

		else {
	  		//case were it's -1 so do nothing 
	  		//this is because the selectedoption by default is set to  -1 to allow a title for drop down 
	  	}
  }
}

  // creates a prov version of a 'thing' story element param
  // adds it to global prov document 
  processThing(thing) {

  	let inputArray = thing.inputArray;
  	let attributeArray = thing.attributes;

	let name = inputArray["0"].value;
	let url = inputArray["1"].value;
	
	//set the name and url of the enetity 
	this.doc.addNamespace(name, url);

	//set any attributes the user has added 
	let titleIndex:number = this.getIndex("Title",inputArray);
	let locationIndex:number = this.getIndex("Location",inputArray);
	let labelIndex:number = this.getIndex("Label",inputArray);
	let typeIndex:number = this.getIndex("Type",inputArray);

	let title:string;
	let location:string;
	let label:string;
	let type:string;

	//keep a ref to entity so we can update its attributes
	var entity  = this.doc.entity(name+":"+ name);


	//-1 indicates that this attribute was not added to the element
	//now lets set our attributess
	// if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
	// CHECK for which attributes a user has set
	// if set set them
	
	if(titleIndex !== -1){
		//set the title to the user's input
		 title = this.inputArray[this.getIndex("Title",this.inputArray).toString()].value;
		 
		if (title !== "") {
			//this.doc.entity(name+":"+ name, ["dcterms:title", title]);
			entity.attr("dcterms:title", [title]);
		}
	}
	if(locationIndex !== -1){
		//set the location to the user's input
		 location = this.inputArray[this.getIndex("Location",this.inputArray).toString()].value;
		 if (location !== "") {
		 	//this.doc.entity(name+":"+ name,["prov:location", location]);
			entity.attr("prov:location", [location]);
		}

	}
	if(labelIndex !== -1){
		//set the label to the user's input
		 label = this.inputArray[this.getIndex("Label",this.inputArray).toString()].value;
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
		 type = this.inputArray[this.getIndex("Type",this.inputArray).toString()].value;
		 if (type !== "") {
			entity.attr(this.prov.ns.qn("type"), this.prov.ns.qn(type));

		}
	}
	
	
	console.log(this.getDoc());
	console.log(JSON.stringify(this.getProvJSON(), null, "  "));

  }

  // creates a prov version of a 'actor' story element param
  // adds it to global prov document 
  processActor(actor) {

  }

  // creates a prov version of a 'event' story element param
  // adds it to global prov document 
  processEvent(event) {

  }

  // this basically takes evrything on the canvas and processes it 
  // it seperates it by type into it's respective methods for further processing 
  // to create a story - using prov 
  process()
  {
  	for (var i = 0; i < this.elementsOnCanvas.length; i++) {

  		//if type is a thing
  		if(this.elementsOnCanvas[i.toString()].type === "thing") {
  			this.processThing(i);
  		}

  		//if type is a thing
  		if(this.elementsOnCanvas[i.toString()].type === "event") {
  			this.processEvent(i);
  		}

  		// if type is actor
  		else {
  			this.processActor(i);
  		}
  	};
  }

  export() {
  	console.log(this.getDoc());
  }


  // //using it for a 'thing's attribute array
  // removeAttributeFromList(item:string) {

  // 	for (var i = 0; i < this.attributesArray.length; i++) {
  // 		if(this.attributesArray[i].name === item){
  // 			this.attributesArray.splice( i, 1 );
  // 		}
  // 	};

  // }



  //remove an given attribute from a given attribute arrasy 
  removeAttributeFromList(item:string, attributeArray) {

  	for (var i = 0; i < attributeArray.length; i++) {
  		if(attributeArray[i].name === item){
  			attributeArray.splice( i, 1 );
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
	
// 	//adds an <input> given by id to the fieldset of a thing 
// 	// or adds an attribute that the user selcted from the drop down
//  addClickedAttr(attributeNum:number) {
//   	//this.attributedSelected= false;
//   	console.log(attributeNum);

//   	//only allowed to have max 3 extra attributes 
//   	//stop adding stop adding more atributes
//   	if(this.inputArray.length <= 5 ) {
//   			// title attr 
// 	  	if(attributeNum === 1) {
// 	  		//this.attributedSelected = true;
// 	  		//ensure no dupes use salt id
// 	  		// so each input can be uniquely identified
// 	  		this.inputArray.push({name:"title",value:"", id:this.generateUUID()});
// 	  		//remove from areay so users cant choose it 
// 	  		//remove title from list so they cant add it again
// 	  		this.removeAttributeFromList("title");
	  		
// 	  	} 
// 	  	//label attr 
// 	  	else if(attributeNum === 2) {
// 	  		//this.attributedSelected2 = true;
// 	  		this.inputArray.push({name:"label",value:"", id:this.generateUUID()});
// 	  		//remove label from list so they cant add it again
// 	  		this.removeAttributeFromList("label");
// 	  	} 
// 	  	//location attr 
// 	  	else if (attributeNum === 0) {
// 	  		//this.attributedSelected0 = true;
// 	  		this.inputArray.push({name:"location",value:"", id:this.generateUUID()});
// 	  		//remove location from list so they cant add it again
// 	  		this.removeAttributeFromList("location");
// 	  	}
// 	  	//location attr 
// 	  	else if (attributeNum === 3) {
// 	  		//this.attributedSelected0 = true;
// 	  		this.inputArray.push({name:"type",value:"", id:this.generateUUID()});
// 	  		//remove location from list so they cant add it again
// 	  		this.removeAttributeFromList("type");
// 	  	}

// 		else {
// 	  		//case were it's -1 so do nothing 
// 	  		//this is because the selectedoption by default is set to  -1 to allow a title for drop down 
// 	  	}
//   }

//  	else {
//   	alert("Reached max number of attributes that can be added!");
//   }
  	
// }

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
