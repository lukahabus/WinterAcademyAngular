import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AddUpdateSensorsTypeComponent } from '../add-update-sensors-type/add-update-sensors-type.component';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { ISensorType } from '../shared/models/ISensorType';
import { SensorTypesService } from '../shared/services/sensor-types.service';

@Component({
  selector: 'app-sensor-types',
  templateUrl: './sensor-types.component.html',
  styleUrls: ['./sensor-types.component.scss']
})
export class SensorTypesComponent implements OnInit {

  sensorTypes: ISensorType[] = [];

  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<ISensorType>(this.allowMultiSelect, this.initialSelection);

  displayedColumns: string[] = ['id', 'description', 'lowestValueExpected', 'highestValueExpected', 'update', 'delete'];

  constructor(private dialog : MatDialog, private sensorTypesService : SensorTypesService) { }

  ngOnInit(): void 
  {
    this.getSensorTypes();
  }

  dataSource!: MatTableDataSource<ISensorType>;

  @ViewChild('paginator') paginator!: MatPaginator;

  setDataSource() 
  {
    this.dataSource = new MatTableDataSource<ISensorType>();
    this.dataSource.data = this.sensorTypes;
    this.dataSource.paginator = this.paginator;
  }

  getSensorTypes()
  {
    this.sensorTypesService.getSensorTypes().subscribe({
      next: sensorTypes => {
        this.sensorTypes = sensorTypes;
        console.log(`getSensorTypes subscribe -> next notification: ` + JSON.stringify(this.sensorTypes));
        this.setDataSource();
      },
      error: err => {
        console.log(`getSensorTypes subscribe -> error notification`);
      },
      complete() {
        console.log(`getSensorTypes subscribe -> complete notification`);
      },
    });
  }

  onAddClick()
  {
    let dialogRef = this.dialog.open(AddUpdateSensorsTypeComponent, { data: {"method": "Add"} });

    let message = "";

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Added')
      {
        this.getSensorTypes();

        console.log(result.data);
        message = result.data;
        this.openMessageDialog(message, "Add sensor");

      }
    });
  }

  onUpdateClick(sensorType : ISensorType) 
  {
    let dialogRef = this.dialog.open(AddUpdateSensorsTypeComponent, { data: {"method": "Update", "sensorType": sensorType} });

    let message = "";

    dialogRef.afterClosed().subscribe(result => {

      if (result.event == 'Updated')
      {
        this.getSensorTypes();

        console.log(result.data);
        message = result.data;
        this.openMessageDialog(message, "Update sensor");
      }
    });
  }

  onDeleteClick(sensorTypeId: number) 
  {
    this.sensorTypesService.deleteSensorType(sensorTypeId)
      .subscribe(response => {
        this.sensorTypes = this.sensorTypes.filter(sensorType => sensorType.id !== sensorTypeId);
        this.refreshTable();
      });
  }

  openMessageDialog(message : string, title : string)
  {
    this.dialog.open(MessageDialogComponent, { data: {"message": message, "title": title} });
  }

  @ViewChild('table') table! : MatTable<ISensorType>; 

  refreshTable()
  {
    //update table data source - creating a new datasource is necessary, do not put displayedNotifications directly into table.dataSource!
    let dataSource = new MatTableDataSource<ISensorType>();
    dataSource.data = this.sensorTypes;
    dataSource.paginator = this.paginator;
    this.table.dataSource = dataSource;
  }


}
