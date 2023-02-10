import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISensorType } from '../shared/models/ISensorType';
import { SensorTypesService } from '../shared/services/sensor-types.service';

@Component({
  selector: 'app-add-update-sensors-type',
  templateUrl: './add-update-sensors-type.component.html',
  styleUrls: ['./add-update-sensors-type.component.scss']
})
export class AddUpdateSensorsTypeComponent implements OnInit {

  updateMethod : boolean = true;
  title : string | undefined;
  
  sensorType : ISensorType | undefined;

  id : number | undefined;
  description : string | undefined;
  lowestValueExpected : number | undefined;
  highestValueExpected : number | undefined;

  message = "";

  ngOnInit() 
  {
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<AddUpdateSensorsTypeComponent>,
    private sensorTypesService : SensorTypesService)
    {
    console.log("Data " + JSON.stringify(data));

    this.updateMethod = (data.method == "Update");
    this.title = (this.updateMethod) ? `Update sensor type ${data.sensorType.id}` : `Add new sensor type`;

    if (this.updateMethod)
      this.fillFieldsExistingData(data);
    else
    {
      this.fillFieldsDefaultData();
    }
  }

  fillFieldsExistingData(data : any)
  {
    this.sensorType = data.sensorType;

    this.id = this.sensorType!.id;
    this.description = this.sensorType!.description;
    this.lowestValueExpected = this.sensorType!.lowestValueExpected;
    this.highestValueExpected = this.sensorType!.highestValueExpected;
  }

  fillFieldsDefaultData()
  {
    this.description = "";
    this.lowestValueExpected = 0;
    this.highestValueExpected = 1;
  }

  async add()
  {
    let newSensorType : ISensorType = {
      description: this.description!,
      lowestValueExpected: this.lowestValueExpected!,
      highestValueExpected: this.highestValueExpected!,
    };

    if (!this.validateInput()) 
      return;

    let message = "";

    const get = this.sensorTypesService.addSensorType(newSensorType);
    get.subscribe({
      next: sensorType => {
        console.log(`addSensorType subscribe -> next notification: ` + JSON.stringify(sensorType));
        message = "Sensor type successfully added";
        this.closeDialog(message);
      },
      error: err => {
        console.log(`addSensorType subscribe -> error notification`);
        message = `Error - sensor type not added ${err}`;
      },
      
    });
    
  }

  update()
  {
    if (!this.validateInput()) 
      return;

    let updatedSensorType : ISensorType = this.sensorType!;
    updatedSensorType.description = this.description!;
    updatedSensorType.lowestValueExpected = this.lowestValueExpected!;
    updatedSensorType.highestValueExpected = this.highestValueExpected!;

    let message = "";
    this.sensorTypesService.updateSensorType(updatedSensorType).subscribe({
      next: sensorType => {
        console.log(`updateSensorType subscribe -> next notification: ` + JSON.stringify(sensorType));
        message = "Sensor type successfully updated";
        this.closeDialog(message);
      },
      error: err => {
        console.log(`updateSensorType subscribe -> error notification`);
        message = `Error - sensor type not updated. ${err}`;
      }
    });
    
  }

  closeDialog(message : string)
  {
    let eventType = (this.updateMethod) ? "Updated" : "Added";
    this.dialogRef.close({event: eventType, data: message});
  }

  validateInput() : boolean
  {
    if (this.updateMethod &&
      this.description == this.sensorType!.description && 
      this.lowestValueExpected == this.sensorType!.lowestValueExpected &&
      this.highestValueExpected == this.sensorType!.highestValueExpected) 
    {
      this.message = "No new values entered";
      return false;
    }

    if (this.containsOnlyWhitespace(this.description!))
    {
      this.message = "Enter description";
      return false;
    }

    if (this.lowestValueExpected! > this.highestValueExpected!)
    {
      this.message = "Lowest value cannot be higher than highest value";
      return false;
    }

    this.message = "";
    return true;
  }

  containsOnlyWhitespace(str : string)
  {
    return /^\s*$/.test(str);
  }

}
