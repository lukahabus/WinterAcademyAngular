import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { INotification } from '../shared/models/INotification';
import { ISensorType } from '../shared/models/ISensorType';
import { NotificationsService } from '../shared/services/notifications.service';
import { SensorTypesService } from '../shared/services/sensor-types.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ISensor } from '../shared/models/ISensor';
import { SensorsService } from '../shared/services/sensors.service';
import { MatPaginator } from '@angular/material/paginator';
import { MessageDialogComponent } from '../message-dialog/message-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../shared/services/email.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  displayedNotifications: INotification[] = [];
  allNotifications: INotification[] = [];

  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<INotification>(this.allowMultiSelect, this.initialSelection);

  displayedColumns: string[] = ['id', 'sensorId', 'status', 'dateTimeReceived', 'delete'];

  constructor(
    private router: Router,
    private notificationsService: NotificationsService,
    private sensorsService : SensorsService,
    private sensorTypesService : SensorTypesService,
    public dialog : MatDialog,
    private emailServices : EmailService)
  {
    this.showSensorTypes();
    this.showNotifications();
  }

  ngOnInit()
  {
  }


  showSensorTypes()
  {
    //fill select box with sensor type options available
    this.sensorTypesService.getSensorTypes().subscribe({
      next: sensorTypes => {
        this.sensorTypes = sensorTypes;
        console.log(`getSensorTypes subscribe -> next notification: ` + JSON.stringify(this.sensorTypes));
      },
      error: err => {
        console.log(`getSensorTypes subscribe -> error notification ${err}`);
      }
    });
  }

  showNotifications()
  {
    this.notificationsService.getNotifications().subscribe({
      next: notifications => {
        this.allNotifications = notifications.reverse();
        this.displayedNotifications = this.allNotifications.slice();
        console.log(`getNotifications subscribe -> next notification: ` + JSON.stringify(this.allNotifications));
        this.setDataSource();
      },
      error: err => {
        console.log(`getNotifications subscribe -> error notification`);
      }
    });

  }

  @ViewChild('table') table! : MatTable<INotification>;

  sortNotifications()
  {
    //clear the array before sorting
    this.displayedNotifications.splice(0);
    //console.log("before " + this.displayedNotifications.length + " " + this.allNotifications.length);

    if (this.num)
    {
      this.allNotifications.forEach (
        notification => {
          if (notification.sensorId.toString().includes(this.num!.toString()))
            this.displayedNotifications.push(notification);
        }
      );
      //console.log("now " + this.displayedNotifications.length);
      this.refreshTable();

    }

    /*if (this.selectedSensorType)
    {
      console.log("Selected: " + this.selectedSensorType.description);
      this.displayedNotifications.forEach (
        notification => {
          this.sensorsService.getSensor(notification.sensorId).subscribe({
            next: sensor => {
              console.log(this.selectedSensorType!.id + " " + sensor.typeId);
              if (sensor.typeId == this.selectedSensorType!.id)
              {
                this.displayedNotifications.push(notification);
                this.refreshTable();
              }
            },

        });
        }
      );

    }*/

    if (!this.num && !this.selectedSensorType && !this.selectedOption)
    {
      this.displayedNotifications = this.allNotifications.slice();
      this.refreshTable();
    }


  }

  dataSource!: MatTableDataSource<INotification>;

  @ViewChild('paginator') paginator!: MatPaginator;

  setDataSource()
  {

    this.dataSource = new MatTableDataSource<INotification>();
    this.dataSource.data = this.displayedNotifications;
    this.dataSource.paginator = this.paginator;
    //this.table.dataSource = dataSource;
  }

  refreshTable()
  {
    //update table data source - creating a new datasource is necessary, do not put displayedNotifications directly into table.dataSource!
    let dataSource = new MatTableDataSource<INotification>();
    dataSource.data = this.displayedNotifications;
    dataSource.paginator = this.paginator;
    this.table.dataSource = dataSource;
  }

  formatDate(datetime : string)
  {
    let date = new Date(Date.parse(datetime));
    return date.toDateString() + ", " + date.toLocaleTimeString();
  }

  //

  sensorTypes? : Array<ISensorType>;
  selectedSensorType? : ISensorType;
  selectSortOptions : Array<string> = ["Date", "Sensor", "Sensor type"];
  selectedOption : string = this.selectSortOptions[0];
  selectedOptionValue : string = "d";
  selectedDate? : string; // = "2023-02-16T10:04:47.466Z";
  keywords? : string;
  num? : number;

  //@ViewChild('pagingNotifications') pagingNotifications! : PagingComponent;

  ngDoCheck()
  {
    console.log("Statusi: " + this.keywords + " " + this.selectedSensorType?.description + " " + this.selectedDate + " " + this.selectedOption);
  }

  sortOptionChanged(selectedOption : any)
  {
    console.log(selectedOption);
    let val : string;
    switch(selectedOption)
    {
      case "Date": val = 'd'; break;
      case "Sensor": val = 's'; break;
      case "Sensor type": val = 't'; break;
    }
    this.selectedOption = selectedOption;
    this.selectedOptionValue = val!;
    console.log("val " + val! + " " + this.selectedOption + " " + this.selectedOptionValue);
    //this.dajFilmove(1);
  }

  sensorTypeSelected(selectedType : ISensorType)
  {
    console.log(selectedType.description);
    this.selectedSensorType = selectedType;
    console.log(this.selectedSensorType.description);
    this.sortNotifications();
  }

  dateSelected(selectedDate : any)
  {
    this.selectedDate = (selectedDate as string).split(" GMT")[0];
    console.log(this.selectedDate);
    //this.dajFilmove(1);
  }

  keywordChanged(keywords : any)
  {
    var num = keywords.replace(/[^0-9]/g, '');
    //keywords = parseInt(keywords);
    if (!num) num = null;

    console.log(num + " " + this.allNotifications.length);
    this.num = num;
    this.sortNotifications();
  }

  isUnexpectedValue(element : ISensor)
  {
    return element.currentStatus < element.typeLowestValueExpected!! || element.currentStatus > element.typeHighestValueExpected!! ? 'red' : '';
  }

  onDeleteClick(notificationId: number)
  {
    this.notificationsService.deleteNotification(notificationId)
      .subscribe(response => {
        this.displayedNotifications = this.displayedNotifications.filter(notifcation => notifcation.id !== notificationId);
        this.refreshTable();
      });
  }

}
