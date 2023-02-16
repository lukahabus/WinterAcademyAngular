import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { ISocketNotifyMessage } from '../models/ISocketNotifyMessage';
import { EmailService } from './email.service';
import { Subject } from 'rxjs';
import { __values } from 'tslib';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private hubConnection!: signalR.HubConnection;
  connectionAttempts: number = 0;
  isConnected = false;
  isWorking = true;
  isWorkingChange: Subject<boolean> = new Subject<boolean>();
  sensorId : number = 0;
  sensorIdChange: Subject<number> = new Subject<number>();

  constructor(private emailService : EmailService) {
    this.isWorkingChange.subscribe((value) => {
      this.isWorking = value;
    })
    this.sensorIdChange.subscribe((value) => {
      this.sensorId = value;
    })
  }

  public buildConnection(): void{
    if(this.isConnected == false){
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${apiUrl}appHub`).build();

      this.startConnection();

      this.hubConnection.on('camundaMessageHub', (data: ISocketNotifyMessage) => {
        //console.log(`socket message has been received: ${JSON.stringify(data)}`);
        //alert(`socket message has been received: ${JSON.stringify(data)}`);

        let title = 'Sensor is not working';
        this.isWorkingChange.next(!this.isWorking);
        this.sensorIdChange.next(Number(data.sensorID));

        this.emailService.sendEmailSmtp(environment.sender, environment.receiver, title, data.message);
      })
    }
  }

  private startConnection = () => {
    this.connectionAttempts++;

    this.hubConnection
      .start()
      .then(() => {
        this.connectionAttempts = 0;
        this.isConnected = true;
        console.log('socket Connection has been started');
      })
      .catch(err => {
        console.log('socket error while establishing connection');
        setTimeout(() => {
          this.startConnection();
        }, 5000);
      })
  }
}
