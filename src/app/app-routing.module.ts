import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SensorTypesComponent } from './sensor-types/sensor-types.component';
import { SensorsComponent } from './sensors/sensors.component';

const routes: Routes = [
  { path: '', redirectTo: '/sensors', pathMatch: 'full' },
  { path: 'sensors', component: SensorsComponent},
  { path: 'sensor-types', component: SensorTypesComponent},
  { path: 'notifications', component: NotificationsComponent},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
