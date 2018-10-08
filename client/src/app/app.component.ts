import {Component, OnInit} from '@angular/core';
import {ChatService} from '../chat.service';

import * as moment from 'moment';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/throttleTime';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  message: string;
  messages: {'message': string, 'userName':string, 'colorClass': string}[] = [];
  secretCode: string;
  userName: string='';
  chatUserName: string='';
  startChat: boolean = false;

  constructor(private chatService: ChatService) {
    this.secretCode = 'DONT TELL';
  }

  sendUser(){
    this.chatService.sendUser(this.userName);
    this.startChat = true;
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.chatService
      .getMessages()
      .distinctUntilChanged()
      // .filter((message) => message.trim().length > 0)
      // .throttleTime(1000)
      // .skipWhile((message) => message !== this.secretCode)
      // .scan((acc: string, message: string, index: number) =>
      //  `${message}(${index + 1})`
      //  , 1)
      .subscribe((message: {'message': string, 'userName':string, 'colorClass': string}) => {
        // const currentTime = moment().format('hh:mm:ss a');
        // const messageWithTimestamp = `${currentTime}: ${message}`;
        // this.messages.push(messageWithTimestamp);
        if(message.userName === this.userName){
          message.colorClass = "blueText";
        } else{
            message.colorClass = "greenText";
        }
        console.log('--received messages--', message);
        this.messages.push(message);
      });
  }
}
