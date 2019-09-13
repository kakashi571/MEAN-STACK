import { Component } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  message;
  userName;
  messages: [];

  constructor(private http: HttpClient){
  }

   async ngOnInit(){
   this.messages =  (await this.http.get('http://localhost:3000/api/message').toPromise()) as any;
   console.log(this.messages);
  }

  post(){
    console.log("post", this.message);
    this.http.post('http://localhost:3000/api/message',{msg:this.message, userName: this.userName}).toPromise();
  }
}
