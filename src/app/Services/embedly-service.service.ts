import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
	



@Injectable()
export class EmbedlyService {

	constructor(private http: Http) { }

	EMBEDLY_KEY = '9d73e061a5b14fb493300383ac612299';
	embedlyApi:string = "https://api.embedly.com/1/extract?key=:9d73e061a5b14fb493300383ac612299&url="


	//
	checkUrl() {

	}

	/***
	* takes a url and returns a obj containing a summary data of that URL 
	*/
	getUrlSummary(url:string) :Promise<any> {

		//check that url is in correct format
		// call single url
		//var url = 'http://www.youtube.com/watch?v=Zk7dDekYej0';
		let QueryUrl =  this.embedlyApi + url;
	    console.log('getting url summary)');
	    return this.http.get(QueryUrl)
	                 .toPromise()
	                 .then(response => response.json())
	                 .catch(this.handleError);

  }


  private handleError(error: any) {
     console.error('An error occurred', error);
     return Promise.reject(error.message || error);
  }


}