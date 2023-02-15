import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { ISocketNotifyMessage } from '../models/ISocketNotifyMessage';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private hubConnection!: signalR.HubConnection;
  connectionAttempts: number = 0;
  isConnecred = false;

  constructor() { }

  public buildConnection(): void{
    if(this.isConnecred == false){
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(`${apiUrl}appHub`).build();

      this.startConnection();

      this.hubConnection.on('camundaMessageHub', (data: ISocketNotifyMessage) => {
        console.log(`socket message has been received: ${JSON.stringify(data)}`);
        alert('socket message has been received: ${JSON.stringify(data)}');
      })
    }
  }

  private startConnection = () => {
    this.connectionAttempts++;

    this.hubConnection
      .start()
      .then(() => {
        this.connectionAttempts = 0;
        this.isConnecred = true;
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
