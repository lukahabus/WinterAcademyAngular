import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from 'src/app/message-dialog/message-dialog.component.js';
import './../../../assets/smtp.js';
//declare let Email: any;


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private _snackBar: MatSnackBar){}

  sendEmailSmtp(sender : string, receiver : string, title : string, message : string)
  {
    Email.send({
      Host : 'smtp.elasticemail.com',
      Username : 'habusluka.gdi@gmail.com',
      Password : '34DF1A7DE29ADAB12C0E7BF5910EE3686720',
      To : receiver,
      From : sender,
      Subject : title,
      Body : message
      }).then(
        (res: any) => {
        //alert(`Sent message ${message} from ${sender} to ${receiver}`);
        this._snackBar.open(`Sent message from ${sender} to ${receiver}`, "Ok");
      } );
  }


}
