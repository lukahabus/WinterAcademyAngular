import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SensorsComponent } from './sensors/sensors.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { SensorTypesComponent } from './sensor-types/sensor-types.component';
import { UpdateSensorComponent } from './update-sensor/update-sensor.component';
import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { AddUpdateSensorsTypeComponent } from './add-update-sensors-type/add-update-sensors-type.component';
import { SettingsComponent } from './settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    SensorsComponent,
    NotFoundComponent,
    NotificationsComponent,
    SensorTypesComponent,
    UpdateSensorComponent,
    MessageDialogComponent,
    AddUpdateSensorsTypeComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
