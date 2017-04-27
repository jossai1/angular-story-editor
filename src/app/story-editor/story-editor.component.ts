import { Component, OnInit, SimpleChange, ElementRef } from '@angular/core';
import { ConfirmationService } from 'primeng/primeng';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { EmbedlyService } from '../services/embedly-service.service';
import 'rxjs/add/operator/toPromise';


interface attribute {
  name: string,
  id:number
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


  constructor (private confirmationService: ConfirmationService, private http: Http, private embedlyService: EmbedlyService) {

      // confirm if users would like to leave page 
      window.onbeforeunload = function(e) {
        return 'Your story will not be saved.';
      };
  }



  prov:any = require('../../../provjs/prov');
  doc:any =  this.prov.document();
  provstore:any = require('../../../provjs/provstore');
 

  ex = this.doc.addNamespace("ex", "http://www.example.org#");
  dcterms = this.doc.addNamespace("dcterms", "http://purl.org/dc/terms/");
  foaf = this.doc.addNamespace("foaf", "http://xmlns.com/foaf/0.1/");
  storyTitle:string="";
  storyUrl:string; //url to prov store
  private provStoreUrl = 'https://provenance.ecs.soton.ac.uk/store/api/v0/documents/';
  
  //respponse returned from provstore -> json obj that contains id to doc,
  provStoreResponse:any;
  error:any;
 
  //a list that represents every element on the canvas 
  //grows dynamically 
  elementsOnCanvas:Array<Object> = [];
  
  //just set it to smhting - doesnt show add titile to box 
  selectedOption:attribute = {name:"attributes..",id:-1};

  twoSelectedElements:any [] = []; //array of twoclicked eles
  selecting:boolean = false;
  connections:any [] = [];

  errorMessages:any[] = [];

  Shepherd:any = require('../../assets/shepherd-1.8.0/dist/js/shepherd');;
  tour:any;





  showMissingURLFieldError() {
     this.errorMessages = [];
     this.errorMessages.push({severity:'error', summary:'Please fill in all url fields', detail:'Validation failed'});
  }

   showSyntaxError() {
     this.errorMessages = [];
     this.errorMessages.push({severity:'error', summary:'Please check syntax', detail:'Validation failed'});
  }

   showMissingTitleError() {
     this.errorMessages = [];
     this.errorMessages.push({severity:'warn', summary:'Please name the story in the "story title" field and make sure elements are present on canvas', detail:'Export Failed'});
  }

  clearMessage() {
     this.errorMessages = [];
  }

  ngOnInit() {

    this.startTour(); //start tutorial 
  }
 
  startTour()
  {
    this.tour = new this.Shepherd.Tour({
      defaults: {
        classes: 'shepherd-theme-arrows',
        scrollTo: false,
        showCancelLink:true
      }
    });

    this.tour.addStep('welcome', {
    text: 'Welcome to the Story Editor! Here you can create provenance-based stories and export them!',
    attachTo: '.navbar-brand left',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

    this.tour.addStep('story-elements', {
    text: 'These are story elements. Hover over them for more info',
    attachTo: '.well right',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

    this.tour.addStep('click-2-add', {
    text: 'Click on an element to add it to the canvas. Try it! <br> <img src="../../assets/images/click2add.gif" alt="Click 2 add" style="width:500px;height:228px;">',
    attachTo: '.well right',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });



  this.tour.addStep('move-elements', {
    text: 'You can re-arrange elements on the canvas <br> <img src="../../assets/images/move-around.gif" alt="Rearrange" style="width:500px;height:228px;">',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

  this.tour.addStep('dbclick', {
    text: 'Click the "maximize" icon to enter edit mode. <br> In edit mode you can edit elements. <br> <img src="../../assets/images/maximise.gif" alt="maximise" style="width:500px;height:228px;">',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

  this.tour.addStep('urls', {
    text: 'Just search Google for whatever URL you want! <br> Then in edit mode you can drag and drop the URL to it\'s input field. <br> <img src="../../assets/images/addUrl.gif" alt="addUrl" style="width:500px;height:228px;">',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

  this.tour.addStep('url-preview', {
    text: 'Once an element\'s url field has been set, <br> click the "eye" icon to preview the URL <br> <img src="../../assets/images/urlPreview.gif" alt="urlPreview" style="width:500px;height:228px;">',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('add-attr', {
    text: 'Select attributes to add from the dropdown list <br> <img src="../../assets/images/addAttributes.gif" alt="addAttributes" style="width:500px;height:228px;">',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('connect-elements', {
    text: 'You can also connect elements! <br> <img src="../../assets/images/connectedElementsImg.png" alt="connectedElementsImg" style="width:500px;height:228px;"> ',
    attachTo: '.canvas center',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('click-2-connect', {
    text: 'Simply click this button to enter Connection Mode',
    attachTo: '.connect bottom',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('select-2-connect', {
    text: '<p>Then select the 2 elements you wish to connect. <br> The 1st element you select will be the source and the 2nd will be the target </p>  <br> <img src="../../assets/images/connectEles.gif" alt="connectEles" style="width:500px;height:228px;">',
    attachTo: '.connect bottom',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('story-title', {
    text: 'Name your story here',
    attachTo: '.story-title bottom',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Next',
        action: this.tour.next
      }
    ]
  });

this.tour.addStep('export', {
    text: 'Click the "Export" button to export your story to the ProvStore <br> <img src="../../assets/images/export.gif" alt="export" style="width:500px;height:228px;">',
    attachTo: '.export-btn right',
    buttons: [
       {
        text: 'Back',
        action: this.tour.back
      },
       {
        text: 'Done',
        action: this.tour.cancel
      }
    ]
  });

    this.tour.start();

}



  confirm() {
      this.confirmationService.confirm({
          message: " Your story has been created! \r" +
           " Click 'Yes' to visit the document in the ProvStore (opens in newtab) \r" +
           " OR Copy the document's link below: \r" + 
           this.storyUrl,
          accept: () => {
            //open in a new tab.
            window.open (
            this.storyUrl,
            '_blank' // <- This is what makes it open in a new tab.
          );
          }
      });
  }



  //generates random numbers within a specified range
  randomIntFromInterval(min,max)
  {
     return Math.floor(Math.random()*(max-min+1)+min);
  }




  /* 
    * adds an actor to the elementsOnCanvas list
    * which subsequently adds it to the canvas
  */
  addActor() {
    
    let UUID = this.generateUUID();

    this.elementsOnCanvas.push({id:UUID, isEditable:true, urlSummary:{img:"../../assets/images/actor-icon2.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/actor-icon2.png",type:"actor",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Location",id:0},{name:"Label",id:1},{name:"Type",id:2},{name:"Given Name",id:3},{name:"E-mail",id:4}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
        //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);

  }


  /*
   * adds an event  to the elementsOnCanvas list
   * which subsequently adds it to the canvas 
  */
  addEvent() {

    let UUID = this.generateUUID();
    this.elementsOnCanvas.push({id:UUID, isEditable:true, startDate:null,endDate:null,startDateAdded:false, endDateAdded:false ,   urlSummary:{img:"../../assets/images/event64.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/event64.png",type:"event",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Location",id:0},{name:"Label",id:1},{name:"Start Time",id:2},{name:"End Time",id:3}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
       //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);
  }


  /* 
   * adds a thing to the elementsOnCanvas list
   * which subsequently adds it to the canvas 
  */
  addThing() { 
  
    let UUID = this.generateUUID();
    this.elementsOnCanvas.push({id:UUID, isEditable:true, urlSummary:{img:"../../assets/images/document64.png", url:"" ,desc:"No Description", title:"No Title", providerUrl:"#"},prefixSuffix:"", src:"../../assets/images/document64.png",type:"thing",inputArray:[{name:"URL",value:"",id:"0"}],attributeArray:[{name:"Location",id:0}, {name:"Title",id:1},{name:"Label",id:2}]});
    setTimeout(() => {
       jsPlumb.draggable(UUID);
       //place in a diff position each time - fix for overallaping divs issue
       $("#"+ UUID).css({top: this.randomIntFromInterval(1,300), left: this.randomIntFromInterval(1,300)});
    }, 100);

  }

  /* 
    * deletes the elemnt with the given id from the canvas 
    * by deleteing it from the list of elementsOnTheCanvas
  */
  deleteElementFromCanvas(eleId:string) {

    for (var i = 0; i < this.elementsOnCanvas.length; i++) {
      if(this.elementsOnCanvas[i.toString()].id === eleId) {
        this.elementsOnCanvas.splice( i, 1 );
      }
    };

  }


  getDoc() {
    return this.doc.scope;
  }

  getProvJSON() {
    return this.getDoc().getProvJSON();
  }


  /* determine which type of element was clicked - so we can send it to appropriate method 
   * each element has diff types and numbers of attributes 
   * so we need to split this out into their own methods 
  */
  processEleAttribute(selectedAttrId, eleType, inputArray, attributeArray, ele) {

    // type thing
    if (eleType === "thing") {

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



  /*
   * dynamically adds the selected attribute to thing story element
  */
  addClickedAttToThingInput(selectedAttrId: number, inputArray, attributeArray) {

    //only allowed to have max 3 extra attributes 
    //stop adding stop adding more atributes
    if(inputArray.length <= 3 ) {
        
      //location attr 
      if (selectedAttrId === 0) {
     
        inputArray.push({name:"Location",value:"", id:this.generateUUID()});
        //remove location from list so they cant add it again
        this.removeAttributeFromList("Location",attributeArray);
      }
      // title attr 
      else if (selectedAttrId === 1) {
    
        //ensure no dupes use salt id
        // so each input can be uniquely identified
        inputArray.push({name:"Title",value:"", id:this.generateUUID()});
        //remove from areay so users cant choose it 
        //remove title from list so they cant add it again
        this.removeAttributeFromList("Title",attributeArray);
      }

      //label attr 
      else if (selectedAttrId === 2) {
        
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
      //alert("Reached max number of attributes that can be added!");
    }
  }


  /*
   * dynamically adds the selected attribute to actor story element
  */
  addClickedAttToActorInput(selectedAttrId: number, inputArray, attributeArray) {
    
   

    //only allowed to have max 5 extra attributes 
    //stop adding stop adding more atributes
    if(inputArray.length <= 5 ) {
        
      //location attr 
      if (selectedAttrId === 0) {
      
        inputArray.push({name:"Location",value:"", id:this.generateUUID()});
        //remove location from list so they cant add it again
        this.removeAttributeFromList("Location",attributeArray);
      }
      // label attr 
      else if (selectedAttrId === 1) {
    
        //ensure no dupes use salt id
        // so each input can be uniquely identified
        inputArray.push({name:"Label",value:"", id:this.generateUUID()});
        //remove from areay so users cant choose it 
        //remove title from list so they cant add it again
        this.removeAttributeFromList("Label",attributeArray);
      }

      //type attr 
      else if (selectedAttrId === 2) {
        
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
      //alert("Reached max number of attributes that can be added!");
    }
  }

  
  /*
   * dynamically adds the selected attribute to event story element
  */
  addClickedAttToEventInput(selectedAttrId:number, inputArray, attributeArray, ele) {
    
   
    //only allowed to have max 5 extra attributes 
    //stop adding stop adding more atributes
    if(inputArray.length <= 4 ) {
        
      //location attr 
      if (selectedAttrId === 0) {
        
        inputArray.push({name:"Location",value:"", id:this.generateUUID()});
        //remove location from list so they cant add it again
        this.removeAttributeFromList("Location",attributeArray);
      }
      // label attr 
      else if(selectedAttrId === 1) {
    
        //ensure no dupes use salt id
        // so each input can be uniquely identified
        inputArray.push({name:"Label",value:"", id:this.generateUUID()});
        //remove from areay so users cant choose it again
        this.removeAttributeFromList("Label",attributeArray);
      }

      //start time attr 
      else if (selectedAttrId === 2) {
        
        //user has added a start time so lets add a special input box for them 
        //to do this we set the startDateAdded var to true 
        // which will make it appear using ngif 

        ele.startDateAdded = true;
  
        //remove type from list so they cant add it again
        this.removeAttributeFromList("Start Time",attributeArray);
      }

      //end time attr 
      else if (selectedAttrId === 3) {

        //user has added a start time so lets add a special input box for them 
        //to do this we set the startDateAdded var to true 
        // which will make it appear using ngif 

        ele.endDateAdded = true;
        
        //remove type from list so they cant add it again
        this.removeAttributeFromList("End Time",attributeArray);
      }

    else {
        //case were it's -1 so do nothing 
        //this is because the selectedoption by default is set to  -1 to allow a title for drop down 
      }
  }
}

/* 
  * split url and return  the string after the last slash
*/
shortenURLonCard(URL: string): string {

    // so we need to check if theres is a trailing slash and if it exits  -> remove it and THEN WE CAN process 
    if(URL.substr(-1) === '/') {

      URL = URL.substr(0, URL.length - 1);
    }

    //NOW we can process as usual 
    let name:string = /[^/]*$/.exec(URL)[0];


    let length = 28;
                     
    name = name.substring(0, length);
    return name;
  }



  /* 
    * split url and grab the string after the last slash 
    * this will be the element's name
  */
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


  /* creates a prov version of a 'thing' story element param
   * adds it to global prov document 
  */
  processThing(thing) {


    let inputArray = thing.inputArray;
    let attributeArray = thing.attributes;
    let url = inputArray["0"].value;

    //handle case were url has no http:// before it 
    //if the proefix is not ther 
    ///we append it 
    var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  ) {
        url = prefix + url;
    }

    let name = this.getElementNameFromURL(url);

    //just get the suffix without the 'name' bit which is the bit after the last slash 
    url = this.stripTrailingSlash(url);
    url = url.substring(0, url.lastIndexOf('/')) + "/";

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

    if (titleIndex !== -1) {

      //set the title to the user's input
      title = inputArray[this.getIndex("Title",inputArray).toString()].value;

      if (title !== "") {

          entity.attr("dcterms:title", [title]);
      }
    }

    if (locationIndex !== -1) {

      //set the location to the user's input
      location = inputArray[this.getIndex("Location",inputArray).toString()].value;

      if (location !== "") {

          entity.attr("prov:location", [location]);
      }
    }

    if (labelIndex !== -1) {

      //set the label to the user's input
      label = inputArray[this.getIndex("Label",inputArray).toString()].value;

      if (label !== "") {

          entity.attr("prov:label", [label]);
      }
    }
  }

  /* creates a prov version of a 'actor' story element param
   * adds it to global prov document 
  */
  processActor (actor) {

    let inputArray = actor.inputArray;
    let attributeArray = actor.attributes;
    let url = inputArray["0"].value;

    //handle case were url has no http:// before it 
    //if the proefix is not ther 
    ///we append it 
    var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  ) {
        url = prefix + url;
    }

    let name = this.getElementNameFromURL(url);

    //just get the suffix without the 'name' bit which is the bit after the last slash 
    url = this.stripTrailingSlash(url);
    url = url.substring(0, url.lastIndexOf('/')) + "/";

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
   

    if (givenNameIndex !== -1) {
      //set the title to the user's input
      givenName = inputArray[this.getIndex("Given Name",inputArray).toString()].value;

      if (givenName !== "") {

          agent.attr("foaf:givenName", givenName);
      }
    }

    if (emailIndex !== -1) {
        //set the title to the user's input
      email = inputArray[this.getIndex("E-mail",inputArray).toString()].value;

      if (email !== "") {

          agent.attr("foaf:mbox", "<"+email+">");
      }
    }

    if (locationIndex !== -1) {
      //set the location to the user's input
      location = inputArray[this.getIndex("Location",inputArray).toString()].value;

      if (location !== "") {

          agent.attr("prov:location", [location]);
      }

    }

    if (labelIndex !== -1) {
      //set the label to the user's input
      label = inputArray[this.getIndex("Label",inputArray).toString()].value;

      if (label !== "") {

          agent.attr("prov:label", [label]);
      }
    }

    //only agents will have types
    if (typeIndex !== -1) {


      //set the type to the user's input
      type = inputArray[this.getIndex("Type",inputArray).toString()].value;
      
      if (type !== "") {

        //check which type user put/drug in 
        if (type.toLowerCase() === "organisation") {
            agent.attr("prov:type", this.prov.ns.qn("Organization"));
        
        }

        else if (type.toLowerCase() === "person") {

            agent.attr("prov:type", this.prov.ns.qn("Person"));
        }

        else if (type.toLowerCase() === "softwareagent") {

            agent.attr("prov:type", this.prov.ns.qn("SoftwareAgent"));
       
        }

        else {
      
        }
      }
    }

    // console.log(this.getDoc());
    // console.log(JSON.stringify(this.getProvJSON(), null, "  "));


  }

  stripTrailingSlash (str) {

    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
  }

  /* creates a prov version of a 'event' story element param
   * adds it to global prov document 
  */
  processEvent (event) {

    let inputArray = event.inputArray;
    let attributeArray = event.attributes;
    let url = inputArray["0"].value;


    //handle case were url has no http:// before it 
    //if the proefix is not ther 
    ///we append it 
    var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix && url.substr(0, prefix.length+1) !== "https://"  ) {

        url = prefix + url;
    }

    let name = this.getElementNameFromURL(url);
    //just get the suffix without the 'name' bit which is the bit after the last slash 
    url = this.stripTrailingSlash(url);
    url = url.substring(0, url.lastIndexOf('/')) + "/";

    //set the name and url of the enetity 
    this.doc.addNamespace(name, url);

    //set any attributes the user has added 
    let locationIndex:number = this.getIndex("Location",inputArray);
    let labelIndex:number = this.getIndex("Label",inputArray);
    let typeIndex:number = this.getIndex("Type",inputArray);

    let location:string;
    let label:string;
    let type:string;
    let startDate:string;
    let endDate:string; 

    //keep a ref to activity so we can update its attributes
    let activity  = this.doc.activity(name+":"+ name);

    event.prefixSuffix = name+":"+ name; //set element's suffixPrefix


    //-1 indicates that this attribute was not added to the element
   

  
    if(event.startDate !== null) {
   
      startDate = event.startDate.toISOString();

    }

    if (event.endDate !== null) { 
   
      endDate = event.endDate.toISOString();

    }

    //fix for issue #13
    var act = this.doc.activity(name+":"+ name, startDate,endDate);

    if(locationIndex !== -1) {
    //set the location to the user's input
        location = inputArray[this.getIndex("Location",inputArray).toString()].value;

        if (location !== "") {

            act.attr("prov:location", [location]);

        }

    }

    
    if (labelIndex !== -1) {
        //set the label to the user's input
        label = inputArray[this.getIndex("Label",inputArray).toString()].value;

        if (label !== "") {

          act.attr("prov:label", [label]);

        }
    }

  }

  errPresent:boolean = false;

  /*
   * check that all url fields are filled 
   * called in process() method
   * an error is given and elements with mising url are highligthed in red 
  */
  urlFieldCheck() {
   
    this.errPresent = false; 
    for (var i = 0; i < this.elementsOnCanvas.length; i++) {

        if (this.elementsOnCanvas[i.toString()].inputArray["0"].value === "") {
            
            $("#"+ this.elementsOnCanvas[i.toString()].id).css({border: "solid 1px red" }); 
        
            this.errPresent = true;
        }
        else {
          //
        }
      }
  }

  /* 
    * this method basically takes all the elements on the canvas and processes it 
    * it seperates elements by type into it's respective methods for further processing 
  */
  process()
  {
    for (var i = 0; i < this.elementsOnCanvas.length; i++) {

      //if type is a thing
      if (this.elementsOnCanvas[i.toString()].type === "thing") {
        
        this.processThing(this.elementsOnCanvas[i]);
      }

      //if type is a event
      else if (this.elementsOnCanvas[i.toString()].type === "event") {
       
        this.processEvent(this.elementsOnCanvas[i]);
      }

      // if type is actor
      else {
       
        this.processActor(this.elementsOnCanvas[i]);
      }
    };

    this.inferRelations();
  }

 
   
   /* 
    * use to help implement connecting functionality 
    * adds the chosen element's id to array of selected elements
   */
  chosenElement (id) {
   
   
    if (this.selecting == true) {

       if (this.twoSelectedElements.length < 2) {

        $("#"+ id).css({border: "solid 1px red" }); 
        
        this.twoSelectedElements.push(id);

        if (this.twoSelectedElements.length === 2) {

            this.resetSelection();
         }
      
        }
    
        else {
            console.log("you can only selct two at a time");  
        }
    }

    else {
      
    }
  }

  deactivateSelection () {
    $('.card').css('border','none');
    this.selecting = false;
    this.twoSelectedElements = [];
  }

  activateSelectionMode () {
    this.selecting = true;
  }

  resetSelection () {
    this.drawLine(this.twoSelectedElements[0],this.twoSelectedElements[1]);
    this.twoSelectedElements = [];
    this.selecting = false;
  }


  /*
    method used to connect two selected elements on a canvas
  */
  drawLine (sourceId, targetId) {

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
          }
        }
      }]
        ]
    };

        jsPlumb.ready(function() {   
        connection = jsPlumb.connect({source:source, target:target}, commomStyle);
        jsPlumb.repaintEverything(); 
  });
     //add connecion to arr of connections 
     this.connections.push({id:connId,connectionObj:connection});
     this.removeBorder(source,target);
}

  //remove the syling from the two selected elements 
  removeBorder (source, target) {
    //without this the 2nd selcted ele does not get a chance to be red
    //so set timer to delay removal
     setTimeout(() => {
        $("#"+ source).css({border: "none" }); 
        $("#"+ target).css({border: "none" });
    }, 350);
  
  }

  //this method increases the size of the element with the supplied id 
  enlarge (id) {
     $("#"+ id).css({width: "80%" }); 
  }

  //this method decrease the size of the element with the supplied id 
  shrink (id) {
     $("#"+ id).css({width: "250px" }); 
  }


  /*
   * This method infers the relation of conencted pairs
   * the type of relation is determined by the type of the connected elements
   * once the type of relation is determined, the elements are passed to the method that creates that relation in Prov
  */
  inferRelations() {

    this.checkPairings();

    let conectionList = jsPlumb.getConnections();
   
    for (var i = 0; i < conectionList.length; i++) {

      let startEle = this.getElement(conectionList[i.toString()].sourceId);
      let endEle = this.getElement(conectionList[i.toString()].targetId);

      //if null then no element with that id was found

      if (startEle === null || endEle === null ) {

          console.log("Element not found");
      }

      else {

        //delegation 
        if (startEle.type === "actor" && endEle.type === "actor") {

          this.delegation(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        //association
        else if (startEle.type === "event" && endEle.type === "actor") {

          this.association(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        //usage
        else if (startEle.type === "event" && endEle.type === "thing") {

          this.usage(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        //generation
        else if (startEle.type === "thing" && endEle.type === "event") {
          
          this.generation(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        //attribution
        else if (startEle.type === "thing" && endEle.type === "actor") {
          
          this.attribution(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        //derivation
        else if (startEle.type === "thing" && endEle.type === "thing") {
          
          this.derivation(startEle.prefixSuffix,endEle.prefixSuffix);
        }

        else {
         
        }

    }

    };
  }


  /* checks that all the connections are valid in terms of prov relations  
   * removes any incorrect pairing from array
   */  
  checkPairings() {

    let conectionList = jsPlumb.getConnections();

    for (var i = 0; i < conectionList.length; i++) {

      let startEle = this.getElement(conectionList[i.toString()].sourceId);
      let endEle = this.getElement(conectionList[i.toString()].targetId);


      //if null then no element with that id was found
      if (startEle === null || endEle === null ) {
        console.log("Element not found");
      }

      else {
        
        if (startEle.type === "event" && endEle.type === "event") {
            jsPlumb.detach(conectionList[i.toString()]);
        }
        else if (startEle.type === "actor" && endEle.type === "event") {
            jsPlumb.detach(conectionList[i.toString()]);
        }
        else if (startEle.type === "actor" && endEle.type === "thing") {
            jsPlumb.detach(conectionList[i.toString()]);
        }
        else {
            // do nothing
        }
      }
    };
  }

  //returns element from elements on canvas array with given id 
  getElement(eleId: string) {

    let element = null; 

    for (var i = 0; i < this.elementsOnCanvas.length; i++) {

      if(this.elementsOnCanvas[i.toString()].id === eleId) {

        element = this.elementsOnCanvas[i.toString()];
      }
    };

    return element;
  }


  /*all the relations*/


  // creates a derivation type relation with supplied elements
  derivation(startEleName: string, endElementName: string) {

    if (startEleName === "" || endElementName === "") {

    }

    else {
    
      this.doc.wasDerivedFrom(startEleName, endElementName);  
    }
  }
  
  // creates a usage type relation with supplied elements
  usage(startEleName: string, endElementName: string) {

    if (startEleName === "" || endElementName === "") {

    }
     
    else {

      this.doc.used(startEleName, endElementName);
    }
  }

  // creates a generation type relation with supplied elements
  generation(startEleName: string, endElementName: string) {

    if (startEleName === "" || endElementName === "") {

    }
    
    else {

      this.doc.wasGeneratedBy(startEleName, endElementName);
    }
  }

  // creates a attribution type relation with supplied elements
  attribution(startEleName: string, endElementName: string) {
    
    if (startEleName === "" || endElementName === "") {

    }
     
    else {

       this.doc.wasAttributedTo(startEleName, endElementName);
    }
  }

   // creates a association type relation with supplied elements
  association(startEleName: string, endElementName: string) {

    if (startEleName === "" || endElementName === "") {

    }

    else {

      this.doc.wasAssociatedWith(startEleName, endElementName);
    }
    
  }

  // creates a delegation type relation with supplied elements
  delegation (startEleName: string, endElementName: string) {

    if (startEleName === "" || endElementName === "") {

    }
   
    else {

        this.doc.actedOnBehalfOf(startEleName, endElementName);
    }
  }

  /*
   * this method is called when a user clicks the 'export' button
   * it performs syntax and sanity checks on elements on the canvas 
   * if the checks pass it then calls the process() method which converts the story to a prov document 
   * else it displays an error
   * once done, it calls saveToStore(), which saves the document to the provstore

  */
  export() {

    this.errorMessages= [];
    $('.card').css('border','none');

    if (this.storyTitle !== "" && this.elementsOnCanvas.length !== 0) {
      

            this.urlFieldCheck();
            if (this.errPresent === true) {
             
              this.showMissingURLFieldError();
             
            }
            else {
               
               this.process();

               this.saveToStore()
                  .then(response => this.provStoreResponse = response)
                  .catch(error => this.error = error);

                  //check that provstoreresponse is not undefines
                  setTimeout(() => {

                    if (this.provStoreResponse) {
                   
                      let docID = this.provStoreResponse.id;
                      
                      //set story url
                      this.storyUrl = "https://provenance.ecs.soton.ac.uk/store/documents/" + docID;
                      this.confirm();
                    }
                    else {
                      console.log("undefined response");
                    }
                     
               }, 2000);
            }
    }
    else {
      this.showMissingTitleError();
    }

  }


  /* saves the gloabal prov document to the provStore using the provapi
   *  returns a promise with containing store's response 
   */
  saveToStore (): Promise<any> {

    let body = JSON.stringify({"content":this.getProvJSON(),"public":true,"rec_id":this.storyTitle});

    //set required headers 
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization','ApiKey jossai1:ead7d3d3e18845a807ab18af501805e05f7169eb');
    headers.append('Accept','application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.provStoreUrl, body, options)
    .toPromise() 
    .then(response => response.json())
    .catch(this.handleError);
  }



  private handleError(error: any) {
     console.error('An error occurred', error);
     return Promise.reject(error.message || error);
  }
 

  // from stackverflow http://stackoverflow.com/questions/1701898/how-to-detect-whether-a-string-is-in-url-format-using-javascript
  isUrl (s) {
     var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
     return regexp.test(s);
  }

 
/*
    * this method uses embedly's extract api, through the embedly service 
    * Embeldy’s Extract API takes a URL and returns metadata extracted from that URL
*/
  getUrlSummary (ele) {

       let url = ele.inputArray['0'].value;
  
        //only care if the url lenght is greater than 10 
        //else would be serch for letter in embedly
        //check that it is a valid url ..google keep does this :) 
        
        let desc = ele.urlSummary.desc;
        let response;
        
        if (url.length >= 10 && this.isUrl(url)) {

           this.embedlyService
          .getUrlSummary(url)
            .then(res => response= res)
            .catch(error => this.error = error);


            setTimeout(() => {
            
       
              //check for any null or empty stuff
              if (response)
              {
                 // console.log( response );
          
                  if (response.images["0"].url) {
                    //set variables
                    ele.urlSummary.img = response.images["0"].url;
                  }
                  else
                  {
                     ele.urlSummary.img = "";
                  }

                  if(response.url) {
                    ele.urlSummary.url = response.url;

                  }
                  else
                  {
                   ele.urlSummary.url = "";
                  }

                  if (response.title) {

                    ele.urlSummary.title = response.title;
                  }
                  else
                  {
                     ele.urlSummary.title = "No Title";
                  }

                  if (response.description) {

                          //the description is too long so trim it to a certain length
                     let length = 20;
                     desc = response.description;
                      //new length
                      ele.urlSummary.desc = desc.substring(0, length);
                  }
                  else
                  {
                    ele.urlSummary.desc = "No Description";
                  }
              }

              }, 1000);
        }
        else {
          console.log("too short or wrong url format")
          return;
        }
  }

  //resets the global prov document to a new one 
  newStory() {

    let newprov = require('../../../provjs/prov');
    this.prov = newprov;
    
    let newdoc =  newprov.document();
    this.doc = newdoc;

    this.ex = newdoc.addNamespace("ex", "http://www.example.org#");
    this.dcterms = newdoc.addNamespace("dcterms", "http://purl.org/dc/terms/");
    this.foaf = newdoc.addNamespace("foaf", "http://xmlns.com/foaf/0.1/");

  }

  //Resets editor to initial state - clears all fields
  clear () {
    
    this.newStory();
    this.elementsOnCanvas = [];
    this.storyTitle = "";
    this.storyUrl = "";
    jsPlumb.detachEveryConnection();
  }

 

  //remove a given attribute from a given attribute arrasy 
  removeAttributeFromList(item:string, attributeArray) {

    for (var i = 0; i < attributeArray.length; i++) {
      if(attributeArray[i].name === item){
        attributeArray.splice( i, 1 );
      }
    };

  }

  /*Returns index of given item in  the supplied array*/
  getIndex (item: string, array: any []) : number {
   let index = -1;
    for (var i = 0; i < array.length; i++) {
      if(array[i].name === item){
        index = i;
        //return index;
      }
    };
    return index;
  }

  //generate random IDS
  generateUUID () {
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
  }
  
       
    
}

