import { Component, OnInit, SimpleChange, ElementRef } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { EmbedlyService } from '../services/embedly-service.service';
import 'rxjs/add/operator/toPromise';
import { NgGridConfig, NgGridItemConfig, NgGridItemEvent } from "angular2-grid";

interface attribute {
  name: string,
  id:number
}

interface Box {
    id: number;
    config: NgGridItemConfig;
}

declare var $:any;
declare var jsPlumb:any;

@Component({
  selector: 'app-story-editor',
  templateUrl: './story-editor.component.html', 
  styleUrls: ['./story-editor.component.css'],
  providers: [ConfirmationService, EmbedlyService]
})
export class StoryEditorComponent implements OnInit {


  constructor(private confirmationService: ConfirmationService,private http: Http, private embedlyService: EmbedlyService) {}

    private _generateDefaultItemConfig(): NgGridItemConfig {
        return { 'dragHandle': '.handle', 'col': 1, 'row': 1, 'sizex': 1, 'sizey': 1 };
    }

    onDrag(index: number, event: NgGridItemEvent): void {
        // Do something here
    }

    onResize(index: number, event: NgGridItemEvent): void {
        // Do something here
    }

    updateItem(eleId: string, event: NgGridItemEvent): void {
        // Do something here
    }
    
    private gridConfig: NgGridConfig = <NgGridConfig>{
        'margins': [5],
        'draggable': true,
        'resizable': true,
        'max_cols': 0,
        'max_rows': 0,
        'visible_cols': 0,
        'visible_rows': 0,
        'min_cols': 1,
        'min_rows': 1,
        'col_width': 2,
        'row_height': 2,
        'cascade': 'up',
        'min_width': 33, //for size of grid item (holds card)
        'min_height': 22,
        'fix_to_grid': false,
        'auto_style': true,
        'auto_resize': false,
        'maintain_ratio': false,
        'prefer_new': true,
        'zoom_on_drag': false,
        'limit_to_screen': true
    };


  prov:any = require('../../../provjs/prov');
  doc:any =  this.prov.document();
  provstore:any = require('../../../provjs/provstore');
 

  ex = this.doc.addNamespace("ex", "http://www.example.org#");
  dcterms = this.doc.addNamespace("dcterms", "http://purl.org/dc/terms/");
  foaf = this.doc.addNamespace("foaf", "http://xmlns.com/foaf/0.1/");

  url:string="";
  name:string="";
  location:string="";
  label:string="";
  storyTitle:string="";

  //for pairings
  startEleId:string;
  endEleId:string;

  storyUrl:string; //url to prov store
  private provStoreUrl = 'https://provenance.ecs.soton.ac.uk/store/api/v0/documents/';
  //respponse returned from provstore -> json obj that contains id to doc,
  provStoreResponse:any;
  error:any;


  //for bools used for ng if - for start and end time 
  // they need special inputs so to add we will use an ngif 
  startDateAdded:boolean =false;
  endDateAdded:boolean=false;

  //to store input from user 
  startDate: Date;
  endDate: Date;

  //a list that represents every element on the canvas 
  //grows dynamically 
  elementsOnCanvas:Array<Object> = [];
  

  //an array of all the pairings of elements(stores element's id) thatondon a user has made
  //used for making relations
  //when a users makes a connection in the ui 
  //a method is called which pushes the two elements in thisarray 
  // {startEleId:, endEleId:} 
  pairedElementsArray: Array<Object> = [];



  //possible attributes that a user can select
  attributesArray: Array<attribute> = [{name:"attributes..",id:-1},{name:"location",id:0}, {name:"title",id:1},{name:"label",id:2},{name:"type",id:3} ];

  //just set it to smhting - doesnt show add titile to box 
  selectedOption:attribute = {name:"attributes..",id:-1};

  //no  longer in use 
  attributedSelected:boolean = false;

  //an array of all the text boxes in a fieldset 
  // users add more inputs by selecting from a list of atributes - used for a single thing for now 
  inputArray: Array<Object> = [{name:"url",value:"",id:"0"}];

  twoSelectedElements:any [] = []; //array of twoclicked eles
  selecting:boolean = false;
  connections:any [] = [];

  ngOnInit() {
    //test to see if doc is loaded 

    ///add some elemens initially to the element - for ease of testing
    // this.addThing();
    // this.addActor();
    // this.addEvent();
    // console.log(this.doc);
  }
 

confirm() {
        this.confirmationService.confirm({
            message: " Your story has been created! \r" +
             " Click 'Yes' to visit the document in the ProvStore \r" +
             " OR Copy the document's link below: \r" + 
             this.storyUrl,
            accept: () => {
               //Actual logic to perform a confirmation
                window.location.href = this.storyUrl;
            }
        });
    }
  setNameSpace(){
    // Prefix declarations
  }

  randomIntFromInterval(min,max)
  {
     return Math.floor(Math.random()*(max-min+1)+min);
  }

  // adds an actor to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addActor() {
    //for ng2-grid box sizing
    let id = this.elementsOnCanvas.length - 1 ;  
    const conf = this._generateDefaultItemConfig();
    conf.payload = 1 + id;
    let UUID = this.generateUUID();

    this.elementsOnCanvas.push({id:UUID, isEditable:true, config:conf, urlSummary:{img:"../../assets/images/actor-icon2.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/actor-icon2.png",type:"actor",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Given Name",id:3},{name:"E-mail",id:4}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
        //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);

  }

   // adds an event  to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addEvent() {
    //for ng2-grid
    let id = this.elementsOnCanvas.length - 1 ;  
    const conf = this._generateDefaultItemConfig();
    conf.payload = 1 + id;
    let UUID = this.generateUUID();
    this.elementsOnCanvas.push({id:UUID, isEditable:true, config:conf, startDate:null,endDate:null,startDateAdded:false,endDateAdded:false ,   urlSummary:{img:"../../assets/images/event64.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/event64.png",type:"event",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0},{name:"Label",id:1},{name:"Start Time",id:2},{name:"End Time",id:3}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
        //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);
  }

  // adds a thing to the elementsOnCanvas list
  // which subsequently adds it to the canvas
  addThing() { 
    //for ng2-grid box sizing
    let id = this.elementsOnCanvas.length - 1 ;  
    const conf = this._generateDefaultItemConfig();
    conf.payload = 1 + id;
    let UUID = this.generateUUID();
    this.elementsOnCanvas.push({id:UUID, isEditable:true, config:conf, urlSummary:{img:"../../assets/images/document64.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/document64.png",type:"thing",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Attributes..",id:-1},{name:"Location",id:0}, {name:"Title",id:1},{name:"Label",id:2}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
       //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);

  }

  //deletes the elemnt with the given id from the canvas 
  // by deleteing it from the list of elementsOnTheCanvas
  //TODO: HOW TO REMOVE ELEMENT FROM PROV DOCUMENT ALSO ?
  deleteElementFromCanvas(eleId:string) {

    for (var i = 0; i < this.elementsOnCanvas.length; i++) {
      if(this.elementsOnCanvas[i.toString()].id === eleId) {
        this.elementsOnCanvas.splice( i, 1 );
      }
    };

  }


   //deletes the elemnt with the given id from the given array 
  // by deleteing it from the list of elementsOnTheCanvas
  //TODO: HOW TO REMOVE ELEMENT FROM PROV DOCUMENT ALSO ?
  genericDeleteElement(eleId:number , array:Array<Object>) {

    for (var i = 0; i < array.length; i++) {
      if(i === eleId) {
        array.splice( i, 1 );
      }
    };

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
  processEleAttribute(selectedAttrId, eleType, inputArray, attributeArray,ele) {

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
    this.addClickedAttToEventInput(selectedAttrId,inputArray,attributeArray,ele);
  }    

  }

  //add attribute to a thing
  addClickedAttToThingInput(selectedAttrId:number, inputArray, attributeArray) {

    console.log(selectedAttrId);

    //only allowed to have max 3 extra attributes 
    //stop adding stop adding more atributes
    if(inputArray.length <= 3 ) {
        
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
    if(inputArray.length <= 5 ) {
        
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
  addClickedAttToEventInput(selectedAttrId:number, inputArray, attributeArray,ele) {
    
    console.log(selectedAttrId);

    //only allowed to have max 5 extra attributes 
    //stop adding stop adding more atributes
    if(inputArray.length <= 4 ) {
        
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

      //start time attr 
      else if (selectedAttrId === 2) {
        
        //user has added a start time so lets add a special input box for them 
        //to do this we set the startDateAdded var to true 
        // which will make it appear using ngif 

        ele.startDateAdded = true;
        
        //inputArray.push({name:"Start Time",value:"", id:this.generateUUID()});
        //remove type from list so they cant add it again
        this.removeAttributeFromList("Start Time",attributeArray);
      }

      //end time attr 
      else if (selectedAttrId === 3) {

        //user has added a start time so lets add a special input box for them 
        //to do this we set the startDateAdded var to true 
        // which will make it appear using ngif 

        ele.endDateAdded = true;
        
        //inputArray.push({name:"End Time",value:"", id:this.generateUUID()});
        //remove type from list so they cant add it again
        this.removeAttributeFromList("End Time",attributeArray);
      }

    else {
        //case were it's -1 so do nothing 
        //this is because the selectedoption by default is set to  -1 to allow a title for drop down 
      }
  }
}


  //split url and grab the string after the last slash 
  //this will be the element's name
  getElementNameFromURL(URL:string):string {
    
    //name extracted from url 
    // if it ends in http://jane.com/
    //it would return an empty string 

    // so we need to check if theres is a trailing slash and if it exits  -> remove it and THEN WE CAN process 
    if(URL.substr(-1) === '/') {

           URL = URL.substr(0, URL.length - 1);
      }

    //NOW we can process as usual 
      let name:string = /[^/]*$/.exec(URL)[0];
      return name;
  }

  // creates a prov version of a 'thing' story element param
  // adds it to global prov document 
  processThing(thing) {

    
    let inputArray = thing.inputArray;
    let attributeArray = thing.attributes;

    console.log(inputArray);
  
  let url = inputArray["0"].value;

  //handle case were url has no http:// before it 
  //if the proefix is not ther 
  ///we append it 
  var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  )
    {
        url = prefix + url;
    }
  let name = this.getElementNameFromURL(url);

  //just get the suffix without the 'name' bit which is the bit after the last slash 
  url = this.stripTrailingSlash(url);
  url = url.substring(0, url.lastIndexOf('/')) + "/";

  console.log(name,url);
  

  
  //set the name and url of the enetity 
  this.doc.addNamespace(name, url);

  //set any attributes the user has added 
  let titleIndex:number = this.getIndex("Title",inputArray);
  let locationIndex:number = this.getIndex("Location",inputArray);
  let labelIndex:number = this.getIndex("Label",inputArray);
  

  let title:string;
  let location:string;
  let label:string;
  

  //keep a ref to entity so we can update its attributes
  let entity  = this.doc.entity(name+":"+ name);

  thing.prefixSuffix = name+":"+ name; //set element's suffixPrefix


  //-1 indicates that this attribute was not added to the element
  //now lets set our attributess
  // if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
  // CHECK for which attributes a user has set
  // if set set them
  
  if(titleIndex !== -1){
    //set the title to the user's input
     title = inputArray[this.getIndex("Title",inputArray).toString()].value;
     
    if (title !== "") {

      entity.attr("dcterms:title", [title]);
    }
  }
  if(locationIndex !== -1){
    //set the location to the user's input
     location = inputArray[this.getIndex("Location",inputArray).toString()].value;
     if (location !== "") {

      entity.attr("prov:location", [location]);
    }

  }
  if(labelIndex !== -1){
    //set the label to the user's input
     label = inputArray[this.getIndex("Label",inputArray).toString()].value;
     if (label !== "") {
      
      entity.attr("prov:label", [label]);
    }
  }
  
  // console.log(this.getDoc());
  // console.log(JSON.stringify(this.getProvJSON(), null, "  "));

  }

  // creates a prov version of a 'actor' story element param
  // adds it to global prov document 
  processActor(actor) {

    let inputArray = actor.inputArray;
    let attributeArray = actor.attributes;

    // test 
    console.log(inputArray);

  let url = inputArray["0"].value;

  //handle case were url has no http:// before it 
  //if the proefix is not ther 
  ///we append it 
  var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  )
    {
        url = prefix + url;
    }
  let name = this.getElementNameFromURL(url);

  //just get the suffix without the 'name' bit which is the bit after the last slash 
  url = this.stripTrailingSlash(url);
  url = url.substring(0, url.lastIndexOf('/')) + "/";

  console.log(name,url);
  
  
  //set the name and url of the enetity 
  this.doc.addNamespace(name, url);

  //set any attributes the user has added 
  let locationIndex:number = this.getIndex("Location",inputArray);
  let labelIndex:number = this.getIndex("Label",inputArray);
  let typeIndex:number = this.getIndex("Type",inputArray);
  let givenNameIndex:number = this.getIndex("Given Name",inputArray);
  let emailIndex:number = this.getIndex("E-mail",inputArray);

  let location:string;
  let label:string;
  let type:string;
  let givenName:string;
  let email:string; 

  //keep a ref to agent so we can update its attributes
  let agent  = this.doc.agent(name+":"+ name);

  actor.prefixSuffix = name+":"+ name; //set element's suffixPrefix

  //-1 indicates that this attribute was not added to the element
  //now lets set our attributess
  // if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
  // CHECK for which attributes a user has set
  // if set set them
  
  if(givenNameIndex !== -1){
    //set the title to the user's input
     givenName = inputArray[this.getIndex("Given Name",inputArray).toString()].value;

    if (givenName !== "") {

      agent.attr("foaf:givenName", givenName);
    }
  }

  if(emailIndex !== -1){
    //set the title to the user's input
     email = inputArray[this.getIndex("E-mail",inputArray).toString()].value;
     
    if (email !== "") {

      agent.attr("foaf:mbox", "<"+email+">");
    }
  }

  if(locationIndex !== -1){
    //set the location to the user's input
     location = inputArray[this.getIndex("Location",inputArray).toString()].value;
     if (location !== "") {

      agent.attr("prov:location", [location]);
    }

  }

  if(labelIndex !== -1){
    //set the label to the user's input
     label = inputArray[this.getIndex("Label",inputArray).toString()].value;
     if (label !== "") {
      
      agent.attr("prov:label", [label]);
    }
  }

  //only agents will have types
  if(typeIndex !== -1) {

    //todo: have a drop down box for users to select a prov type
    // *** or they can click 'other' and define thir own -- will go for this option (custom type) and drag and drop 
    // these will be two diff use cases 
    // this is just for now till we implement the drag and drop 
    // but we will still need the box their if they want to have thier own custom type 
    // maybe give them the drop down and drag and drop option and in both cases they can create thier own custom types
    // hard code type to Person for now till we decide // let user type in a type for now - has to be on of the inbuilt prov types
    
    //set the type to the user's input
     type = inputArray[this.getIndex("Type",inputArray).toString()].value;
     if (type !== "") {

       //check which type user put/drug in 
       if(type.toLowerCase() === "organisation")
       {
        agent.attr("prov:type", this.prov.ns.qn("Organization"));
        // agent.attr("prov:type", this.prov.ns.Organization);
       }
       else if(type.toLowerCase() === "person")
       {

         agent.attr("prov:type", this.prov.ns.qn("Person"));
       }
       else if(type.toLowerCase() === "softwareagent")
       {

          agent.attr("prov:type", this.prov.ns.qn("SoftwareAgent"));
          // agent.attr("prov:type", this.prov.ns.SoftwareAgent);
       }
       else
       {
         //todo:allert that this field does nt have a valid type
       }

    }
  }
  
  // console.log(this.getDoc());
  // console.log(JSON.stringify(this.getProvJSON(), null, "  "));


  }

  stripTrailingSlash(str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}

  // creates a prov version of a 'event' story element param
  // adds it to global prov document 
  processEvent(event) {

    let inputArray = event.inputArray;
    let attributeArray = event.attributes;

    // test 
    console.log(inputArray);

  let url = inputArray["0"].value;


  //handle case were url has no http:// before it 
  //if the proefix is not ther 
  ///we append it 
  var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  )
    {
        url = prefix + url;
    }

  let name = this.getElementNameFromURL(url);
  //just get the suffix without the 'name' bit which is the bit after the last slash 
  url = this.stripTrailingSlash(url);
  url = url.substring(0, url.lastIndexOf('/')) + "/";

  console.log(name,url);

  //set the name and url of the enetity 
  this.doc.addNamespace(name, url);

  //set any attributes the user has added 
  let locationIndex:number = this.getIndex("Location",inputArray);
  let labelIndex:number = this.getIndex("Label",inputArray);
  let typeIndex:number = this.getIndex("Type",inputArray);

  //not being added to input array - remove?
  // let startTimeIndex:number = this.getIndex("Start Time",inputArray);
  // let endTimeIndex:number = this.getIndex("End Time",inputArray);

  let location:string;
  let label:string;
  let type:string;
  let startDate:string;
  let endDate:string; 

  //keep a ref to activity so we can update its attributes
  let activity  = this.doc.activity(name+":"+ name);

  event.prefixSuffix = name+":"+ name; //set element's suffixPrefix


  //-1 indicates that this attribute was not added to the element
  //now lets set our attributess
  // if an attribute is empty then a user has not set it TODO: maybe set to null instead of empty?
  // CHECK for which attributes a user has set
  // if set set them
  
  //TODO:STORT OUT TIME FORMATTING FOR USERS 
  //MAKE IT EASIER 
  if(event.startDate !== null) {
    //set the title to the user's input
    console.log("startdate added", event.startDate.toISOString());
    startDate = event.startDate.toISOString();

    // activity("startTimee", event.startDate.toISOString());
    
  }

  if(event.endDate !== null){
    //set the title to the user's input
     
    console.log("endDate added", event.endDate.toISOString());
    endDate = event.endDate.toISOString();

    // activity.attr("endTime", event.endDate.toISOString());
  }

  if(locationIndex !== -1){
    //set the location to the user's input
     location = inputArray[this.getIndex("Location",inputArray).toString()].value;
     if (location !== "") {

      activity.attr("prov:location", [location]);
    }

  }

  if(labelIndex !== -1){
    //set the label to the user's input
     label = inputArray[this.getIndex("Label",inputArray).toString()].value;
     if (label !== "") {
      
      activity.attr("prov:label", [label]);
    }
  }
  
  this.doc.activity(name+":"+ name,startDate,endDate);
  // console.log(this.getDoc());
  // console.log(JSON.stringify(this.getProvJSON(), null, "  "));


  }


  // this basically takes evrything on the canvas and processes it 
  // it seperates it by type into it's respective methods for further processing 
  // to create a story - using prov 
  //TODO : ADD IN CHECKS TO MAK SURE URL FIELDS ARE NOT EMPTY 
  //SO IF URL FIELD IS EMPTY ....WE COULD GET THE ID AND HIGHIGHT IT OR ADD A TOAST MESSAGE 
  process()
  {
    for (var i = 0; i < this.elementsOnCanvas.length; i++) {

      //if type is a thing
      if(this.elementsOnCanvas[i.toString()].type === "thing") {
        console.log("thing here");
        this.processThing(this.elementsOnCanvas[i]);
      }

      //if type is a event
      else if(this.elementsOnCanvas[i.toString()].type === "event") {
        console.log("event here");
        this.processEvent(this.elementsOnCanvas[i]);
      }

      // if type is actor
      else {
        console.log("here");
        this.processActor(this.elementsOnCanvas[i]);
      }
    };

    //once all elements have been made-we then need to make relations
    //might need promises ?
    this.inferRelations();
  }

  //check that all url fields are filled 
  //call in process() method
  UrlFieldCheck(){}


highlight() {
  if(this.selecting==true) {
    return "solid 1px red";
  }
  else{

    return "";
  }
}
  chosenElement(id) {
   
    // console.log(value);
    // var target = event.target || event.srcElement || event.currentTarget;
    // var idAttr = target.attributes.id;
    // var value = idAttr.nodeValue;

   
    if(this.selecting == true){
       if(this.twoSelectedElements.length < 2){

        $("#"+ id).css({border: "solid 1px red" }); 
        console.log(id);
        this.twoSelectedElements.push(id);
        if(this.twoSelectedElements.length === 2) {
           this.resetSelection();
         }
      
      }
       else
       {
         console.log("you can only selct two at a time");
         //this.resetSelection();
       }
    }
    else {
      console.log("hit the connect btn first");
    }
   
  }

  deactivateSelection() {
    $('.card').css('border','none');
    this.selecting = false;
    this.twoSelectedElements = [];
  }

  activateSelectionMode()
  {
    this.selecting = true;
    console.log("selecting: ", this.selecting);

  }

  resetSelection ()
  {
    console.log("the selected items are: ", this.twoSelectedElements);
    this.drawLine(this.twoSelectedElements[0],this.twoSelectedElements[1]);
    //this.drawLine();
    this.twoSelectedElements = [];
    this.selecting = false;
  }



  drawLine(sourceId,targetId)
  {

    //which is spurce and which is trget 
    //id 1  is 
    //id 2 is 
    let source = sourceId.toString();
    let target = targetId.toString();
    let connId = this.connections.length+1;
    let connection;
    //common style for all connections 
    var commomStyle = {
        connector:"StateMachine",
        paintStyle:{ stroke:"grey", strokeWidth:5},
        hoverPaintStyle:{stroke:"red"},
        endpoint:"Blank",
        anchors:["Continuous", "Continuous" ],
        overlays:[ ["PlainArrow", {location:1, width:15, length:12} ],
           ["Custom", {
            create:function(component) {
              return $("<button id='myDropDown' style='border: none;border-radius: 15px;'> x </button>");                
            },
            location:0.7,
            id:"customOverlay"
          },{
        events:{
          click:function() { 
             jsPlumb.detach(connection);
            console.log(jsPlumb.getConnections());

             ///remove from list of pairs (copied from deleteapair but couldnt call it from here as js wont let me :/ )
             // for (var i = 0; i < this.pairedElementsArray.length; i++) {
             //    if(this.pairedElementsArray[i.toString()].id === connection.id) {
             //      this.pairedElementsArray.splice( i, 1 );
             //    }
             //    };
          }
        }
      }]
        ]
    };

        jsPlumb.ready(function() {   
        connection = jsPlumb.connect({source:source, target:target}, commomStyle);
        jsPlumb.repaintEverything(); 
        //jsPlumb.draggable($(".window")); //temp - renders funny but the best option, doesnt play nice with nggrid , will remove when i v=come up with another soutuin
  });
     //add connecion to arr of connections 
     this.connections.push({id:connId,connectionObj:connection});
     this.addPair(connection.id,source,target);
     console.log("jsplumbConID",connection.id);
     this.removeBorder(source,target);
}

  //remove the syling from the selected elements ()
  removeBorder(source,target) {
    //without hthis the 2nd selcted ele does not get a chance to e red a
    //so set timer to delay removal
     setTimeout(() => {
        $("#"+ source).css({border: "none" }); 
        $("#"+ target).css({border: "none" });
    }, 300);
  
  }

  enlarge(id)
  {
     $("#"+ id).css({width: "80%" }); 
  }

  shrink(id)
  {
     $("#"+ id).css({width: "24%" }); 
  }
  
  inferRelations() {

    this.checkPairings();

    //might need a promise here 

    for (var i = 0; i < this.pairedElementsArray.length; i++) {

      let startEle = this.getElement(this.pairedElementsArray[i.toString()].startEleId);
      let endEle = this.getElement(this.pairedElementsArray[i.toString()].endEleId);

      //if null then no element with that id was found

      if(startEle === null || endEle === null ){
        console.log("Element not found")
      }

      else {

        //delegation 
      if (startEle.type === "actor" && endEle.type === "actor") {

        console.log("hi delegation");
        this.delegation(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      //association
      else if (startEle.type === "event" && endEle.type === "actor") {

        console.log("hi association");
        this.association(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      //usage
      else if (startEle.type === "event" && endEle.type === "thing") {

        console.log("hi usage");
        this.usage(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      //generation
      else if (startEle.type === "thing" && endEle.type === "event") {
        
        console.log("hi generation");
        this.generation(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      //attribution
      else if (startEle.type === "thing" && endEle.type === "actor") {
        
        console.log("hi attribution");
        this.attribution(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      //derivation
      else if (startEle.type === "thing" && endEle.type === "thing") {
        
        console.log("hi derivation");
        this.derivation(startEle.prefixSuffix,endEle.prefixSuffix);
      }

      else {
        console.log("hmm");
      }

    }

    };
  }


  //check that all the 
  //TODO: add a style(with a message or tooltip or somrthing or red thing) to the elements to show that a wrong relation was made 
  // for now we will remove incorrect pairing from array  
  checkPairings() {

    for (var i = 0; i < this.pairedElementsArray.length; i++) {

      let startEle = this.getElement(this.pairedElementsArray[i.toString()].startEleId);
      let endEle = this.getElement(this.pairedElementsArray[i.toString()].endEleId);

      //if null then no element with that id was found

      if(startEle === null || endEle === null ) {
        console.log("Element not found")
      }

      else {

        
        if (startEle.type === "event" && endEle.type === "event") {
          this.genericDeleteElement(i,this.pairedElementsArray);
          console.log("removing something");
        }
        else if (startEle.type === "actor" && endEle.type === "event") {
          this.genericDeleteElement(i,this.pairedElementsArray);
          console.log("removing something");
        }
        else if (startEle.type === "actor" && endEle.type === "thing") {
          this.genericDeleteElement(i,this.pairedElementsArray);
          console.log("removing something");
        }

        else {

        }
      }
    };

  }

  //returns element from array with corresponding id 
  getElement(eleId:string) {

    let element = null; 

    for (var i = 0; i < this.elementsOnCanvas.length; i++) {
      if(this.elementsOnCanvas[i.toString()].id === eleId) {

        element = this.elementsOnCanvas[i.toString()];
      }
    };

    return element;
  }


  /*all the relations*/
  derivation(startEleName:string, endElementName:string) {

  //dont need local ref -> don't have any attriutes(yet, will keep simple for now sha)

  //if names have not been set -> it means the 'export' button has not been pressed in order to make elements 
  //do nothing -> without this check prov throws errors when the names are empty
  // just used for manual connections
  if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.wasDerivedFrom(startEleName, endElementName);
    console.log("making a derivation");
  }
}
  

  usage(startEleName:string, endElementName:string) {

    if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.used(startEleName, endElementName);
    console.log("making a usage");
  }

  }

  generation(startEleName:string, endElementName:string) {

    if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.wasGeneratedBy(startEleName, endElementName);
    console.log("making a generation");
  }
  }

  attribution(startEleName:string, endElementName:string) {
    

    if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.wasAttributedTo(startEleName, endElementName);
    console.log("making a attribution");
  }
    
  }

  association(startEleName:string, endElementName:string) {

    if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.wasAssociatedWith(startEleName, endElementName);
    console.log("making a association");
  }
    
  }

  delegation(startEleName:string, endElementName:string) {

    if(startEleName === "" || endElementName === "") {

  }
  else {
    this.doc.actedOnBehalfOf(startEleName, endElementName);
    console.log("making a delegation");
  }
  
    
  }


  export() {

    this.process();
    console.log(this.getDoc());
  console.log(JSON.stringify(this.getProvJSON(), null, "  "));

  this.saveToStore()
        .then(response => this.provStoreResponse = response)
        .catch(error => this.error = error);

        //check that provstoreresponse is not undefines
        setTimeout(() => {

          if(this.provStoreResponse){
            console.log(this.provStoreResponse);
            console.log(this.provStoreResponse.id);
            let docID = this.provStoreResponse.id;
            
            //set story url
            //do check here to see if storytitle is empty - if empty -> error message 
            this.storyUrl = "https://provenance.ecs.soton.ac.uk/store/documents/" + docID;
              this.confirm();
          }
          else{
            console.log("undefined response");
          }
          
          
        }, 1000);
  }

  saveToStore (): Promise<any> {

    console.log('its nkechi here again!!!');

    //do check here to see if storytitle is empty - if empty -> error message 
    ///do other checks on content
  let body = JSON.stringify({"content":this.getProvJSON(),"public":true,"rec_id":this.storyTitle});

  //set required headers ..cf /help/api
  let headers = new Headers({ 'Content-Type': 'application/json' });
  headers.append('Authorization','ApiKey jossai1:ead7d3d3e18845a807ab18af501805e05f7169eb');
  headers.append('Accept','application/json');
  let options = new RequestOptions({ headers: headers });

  return this.http.post(this.provStoreUrl, body, options)
        .toPromise() 
        .then(response => response.json())
        .catch(this.handleError);
  }


 //temp? 
 //contains embedly response data 
 embedlyResponse:any;

 private handleError(error: any) {
     console.error('An error occurred', error);
     return Promise.reject(error.message || error);
  }

testInput:string;
testImg:string="";
testResponse:any;
testUrl:string;
testTitle:string = "No Title";
testDesc:string = "No Description";

  testEmbedly() {


this.embedlyService
      .getUrlSummary("https://www.khanacademy.org/")
        .then(res => this.testResponse = res)
        .catch(error => this.error = error);

        //check that provstoreresponse is not undefines
        setTimeout(() => {
          console.log( this.testResponse );
          console.log("embedly stuff: ",  this.testResponse ,  this.testResponse.images["0"].url);

          //set variables
          this.testImg = this.testResponse.images["0"].url;
      this.testUrl = this.testResponse.url;
      this.testTitle = this.testResponse.title;

      //the description is too long so trim it to a certain length
      let length = 20;
      this.testDesc = this.testResponse.description;
      //new length
      this.testDesc = this.testDesc.substring(0, length);
      
          
        }, 2000);
  }


//check every url field and see if it has changed 
// if it has pass that changed value to embedly to update 
updateUrlSummary()
{
  for (var i = 0; i < this.elementsOnCanvas.length; i++) {
    let newUrl = this.elementsOnCanvas[i.toString()].inputArray["0"].url;
    let oldUrl = this.elementsOnCanvas[i.toString()].oldUrl;
    
    console.log("new",newUrl);
    console.log("old",oldUrl);

    if(newUrl)
    {
      //its changes so call emebedly 
      if(newUrl !== oldUrl) {
        console.log("url has changed");
        //call embedly to 
        this.grabURL(newUrl);
      }

    }

    oldUrl = newUrl;
  }
}

// from stackverflow http://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
isUrl(s) {
   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

 delay = (function(){
  var timer = 0;
  return function(callback, ms){
  clearTimeout (timer);
  timer = setTimeout(callback, ms);
 };
})();


 dede(url) {
   let timer:any = 0;
    return new Promise(
      (resolve)=>{ 
        console.log('2.process setting timer');
        
        clearTimeout (timer);
       timer = setTimeout(()=>{
          console.log('4.process timer completed; calling resolve');
        
          resolve('timer complete')}, 5000);
      });
  }

//check when url value changes 
valuechange(url,$event) {

// this.delay(function() {
//     console.log("final value: ", url);
//     //this.getUrlSummary(url);
//   }, 10000 );  



 console.log('1.valuechange calling dede');
    this.dede(url).then(
      (n) => {
        console.log('5.valuechange process promise resolved');
         console.log("final value: ", url);
        console.log(n);
      });
    console.log('3.done');
}


getUrlSummary(url,ele) {
     // if(inputName === "URL"){

     //   if(url !== "")
     //   {
     //     //code below goes in here
     //   }

     // }

        //onlu care if the url lenght is greater than 10 
        //else would be serch for letter in embedly
        //check that it is a valid url ..google keep does this :) 
        let img = ele.urlSummary.img;
        let title = ele.urlSummary.title;
        let desc = ele.urlSummary.desc;
        let URL = ele.urlSummary.url;
        let response;
        
        if(url.length >= 10 && this.isUrl(url)) {

           this.embedlyService
          .getUrlSummary(url)
            .then(res => response= res)
            .catch(error => this.error = error);


            setTimeout(() => {
            
              console.log( response );
              console.log("embedly stuff: ",  response ,  response.images["0"].url);


              //check for any null or e,pty stuff

              if(response.images["0"].url) {
                //set variables
                img = response.images["0"].url;
              }
              else
              {
                img = "";
              }

              if(response.url) {
                URL = response.url;

              }
              else
              {
               URL = "";
              }

              if(response.title) {

                title = response.title;
              }
              else
              {
               title = "No Title";
              }

              if(response.description) {

                      //the description is too long so trim it to a certain length
                  let length = 20;
                 desc = response.description;
                  //new length
                  desc = desc.substring(0, length);
              }
              else
              {
                desc = "No Descrition";
              }
              

              }, 2000);

        }
        else {
          console.log("too short or wrong url format")
          return;
        }
  }

 // getUrlSummary(url) {
 //     // if(inputName === "URL"){

 //     //   if(url !== "")
 //     //   {
 //     //     //code below goes in here
 //     //   }

 //     // }

 //        //onlu care if the url lenght is greater than 10 
 //        //else would be serch for letter in embedly
 //        //check that it is a valid url ..google keep does this :) 
 //        if(url.length >= 10 && this.isUrl(url)) {

 //           this.embedlyService
  //         .getUrlSummary(url)
  //           .then(res => this.testResponse = res)
  //           .catch(error => this.error = error);


  //           setTimeout(() => {
            
  //             console.log( this.testResponse );
  //             console.log("embedly stuff: ",  this.testResponse ,  this.testResponse.images["0"].url);


  //             //check for any null or e,pty stuff

  //             if(this.testResponse.images["0"].url) {
  //               //set variables
  //               this.testImg = this.testResponse.images["0"].url;
  //             }
  //             else
  //             {
  //               this.testImg = "";
  //             }

  //             if(this.testResponse.url) {
  //               this.testUrl = this.testResponse.url;

  //             }
  //             else
  //             {
  //               this.testUrl = "";
  //             }

  //             if(this.testResponse.title) {

  //               this.testTitle = this.testResponse.title;
  //             }
  //             else
  //             {
  //               this.testTitle = "No Title";
  //             }

  //             if( this.testResponse.description) {

  //               //the description is too long so trim it to a certain length
  //           let length = 20;
  //           this.testDesc = this.testResponse.description;
  //           //new length
  //           this.testDesc = this.testDesc.substring(0, length);
  //             }
  //             else
  //             {
  //               this.testDesc = "No Descrition";
  //             }
              

 //              }, 2000);

 //        }
 //        else {
 //          console.log("too short or wrong url format")
 //          return;
 //        }
 //  }


//old and for testing 
 grabURL(url) {

   console.log("change detected");
   console.log(url);
// this.embedlyService
//       .getUrlSummary(url)
//         .then(res => this.testResponse = res)
//         .catch(error => this.error = error);

        //check that provstoreresponse is not undefines

        //onlu care if the url lenght is greater than 10 
        //else would be serch for letter in embedly
        //check that it is a valid url ..google keep does this :) 
        if(url.length >= 10 && this.isUrl(url)) {


           setTimeout(() => {


          setTimeout(() => {

           this.embedlyService
          .getUrlSummary(url)
            .then(res => this.testResponse = res)
            .catch(error => this.error = error);


            setTimeout(() => {
            
                console.log( this.testResponse );
              console.log("embedly stuff: ",  this.testResponse ,  this.testResponse.images["0"].url);


              //check for any null or e,pty stuff

              if(this.testResponse.images["0"].url) {
                //set variables
                this.testImg = this.testResponse.images["0"].url;
              }
              else
              {
                this.testImg = "";
              }

              if(this.testResponse.url) {
                this.testUrl = this.testResponse.url;

              }
              else
              {
                this.testUrl = "";
              }

              if(this.testResponse.title) {

                this.testTitle = this.testResponse.title;
              }
              else
              {
                this.testTitle = "No Title";
              }

              if( this.testResponse.description) {

                //the description is too long so trim it to a certain length
            let length = 20;
            this.testDesc = this.testResponse.description;
            //new length
            this.testDesc = this.testDesc.substring(0, length);
              }
              else
              {
                this.testDesc = "No Descrition";
              }
              

              }, 2000);

          }, 0);

        }, 60000);


        }
        else
        {
          return;
        }
    
  }


  //takes a url 
  //returns all the relvant summary data in an array
  oldGetUrlSummary (url:string): any {
      let response = "";
      this.embedlyService
      .getUrlSummary(url)
        .then(res => response = res)
        .catch(error => this.error = error);

        //check that provstoreresponse is not undefines
        setTimeout(() => {
          console.log(response);
          
        }, 2000);
    return response;
  }


  clear() {
    //only removes elements put the namespace is still there :(
    //reset erthang !
    this.doc = this.prov.document();
    this.elementsOnCanvas = [];
    this.storyTitle = "";
    this.storyUrl = "";
  }

  // old
  // export() {
  //   console.log(this.getDoc());
  // }


  // //using it for a 'thing's attribute array
  // removeAttributeFromList(item:string) {

  //   for (var i = 0; i < this.attributesArray.length; i++) {
  //     if(this.attributesArray[i].name === item){
  //       this.attributesArray.splice( i, 1 );
  //     }
  //   };

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
  
//   //adds an <input> given by id to the fieldset of a thing 
//   // or adds an attribute that the user selcted from the drop down
//  addClickedAttr(attributeNum:number) {
//     //this.attributedSelected= false;
//     console.log(attributeNum);

//     //only allowed to have max 3 extra attributes 
//     //stop adding stop adding more atributes
//     if(this.inputArray.length <= 5 ) {
//         // title attr 
//       if(attributeNum === 1) {
//         //this.attributedSelected = true;
//         //ensure no dupes use salt id
//         // so each input can be uniquely identified
//         this.inputArray.push({name:"title",value:"", id:this.generateUUID()});
//         //remove from areay so users cant choose it 
//         //remove title from list so they cant add it again
//         this.removeAttributeFromList("title");
        
//       } 
//       //label attr 
//       else if(attributeNum === 2) {
//         //this.attributedSelected2 = true;
//         this.inputArray.push({name:"label",value:"", id:this.generateUUID()});
//         //remove label from list so they cant add it again
//         this.removeAttributeFromList("label");
//       } 
//       //location attr 
//       else if (attributeNum === 0) {
//         //this.attributedSelected0 = true;
//         this.inputArray.push({name:"location",value:"", id:this.generateUUID()});
//         //remove location from list so they cant add it again
//         this.removeAttributeFromList("location");
//       }
//       //location attr 
//       else if (attributeNum === 3) {
//         //this.attributedSelected0 = true;
//         this.inputArray.push({name:"type",value:"", id:this.generateUUID()});
//         //remove location from list so they cant add it again
//         this.removeAttributeFromList("type");
//       }

//     else {
//         //case were it's -1 so do nothing 
//         //this is because the selectedoption by default is set to  -1 to allow a title for drop down 
//       }
//   }

//    else {
//     alert("Reached max number of attributes that can be added!");
//   }
    
// }


//delete a pair
//for interactive app
//user select arrow and click 'delete' that point will have an id - which will be the same as the pairing's id in the array
deleteAPair(pairId:string) {

  for (var i = 0; i < this.pairedElementsArray.length; i++) {
    if(this.pairedElementsArray[i.toString()].id === pairId) {
      this.pairedElementsArray.splice( i, 1 );
    }
  };
}

//add a relation 
addPair(connId:string, startEleId:string,endEleId:string) {

  //make pairing - using ngmodel 
  this.pairedElementsArray.push({id: connId, startEleId:startEleId, endEleId:endEleId});
  console.log(this.pairedElementsArray);
}



setValues(name:string) {
  // if(name === "title"){
  //   this.title = name;
  // }
  // else if(name === "url"){
  //   this.url = name;
  // }
  // else if(name === "name"){
  //   this.name = name;
  // }
  // else if(name === "label"){
  //   this.label = name;
  // }
  // else {
  //   this.location = name;
  // }


}

draggedCar:any;
selectedCars:any[]= ["jane"];


// dragStart(event,ele) {
//         this.draggedCar = ele;
//     }
    
//     drop(event) {
//         if(this.draggedCar) {
//             this.selectedCars.push(this.draggedCar);
//             // this.availableCars.splice(this.findIndex(this.draggedCar), 1);
//             this.draggedCar = null;
//         }
//     }
    
//     dragEnd(event) {
//         this.draggedCar = null;
//     }
    
  selectedIcon:any;

  dragStart(event,iconName) {
        this.selectedIcon = iconName;
    }
    
    drop(event) {
        if(this.selectedIcon) {


          if(this.selectedIcon === "thing") {
            this.addThing();
          }
          else if(this.selectedIcon === "actor")
          {
            this.addActor();
          }
          //else event
          else {
            this.addEvent();
          }
            //this.selectedCars.push(this.draggedCar);
            // this.availableCars.splice(this.findIndex(this.draggedCar), 1);
            this.selectedIcon = null;
        }



    }
    
    dragEnd(event) {
        this.selectedIcon = null;
    }
    
}

