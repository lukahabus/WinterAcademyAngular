import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SettingsComponent>) { }

  sender : string = environment.sender;
  receiver : string = environment.receiver;
  numberAPICalls : number = 0;

  message : string = "";

  ngOnInit(): void {
  }

  updateSettings()
  {
    if (!this.validateInput()) 
      return;

    environment.sender = this.sender;
    environment.receiver = this.receiver;

    this.dialogRef.close();

    //alert(environment.sender);
  }

  validateInput() : boolean
  {
    if (this.numberAPICalls < 0)
    {
      this.message = "Number of API calls cannot be negative";
      return false;
    }

    if (!this.isValidEmail(this.sender) || !this.isValidEmail(this.receiver))
    {
      this.message = "Enter valid e-mail address";
      return false;
    }

    if (this.containsOnlyWhitespace(this.sender) || this.containsOnlyWhitespace(this.receiver))
    {
      this.message = "Enter data in all fields";
      return false;
    }

    this.message = "";
    return true;
  }

  containsOnlyWhitespace(str : string)
  {
    return /^\s*$/.test(str);
  }

  isValidEmail(email : string)
  {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }

}
