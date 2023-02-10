import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { INotification } from '../models/INotification';

const apiUrl = environment.apiUrl;
const url = `${apiUrl}api/Notifications`;

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }


  getNotifications(): Observable<INotification[]> 
  {
    return this.http.get<INotification[]>(url)
      .pipe(
        tap(data => {
          console.log('getNotifications: ' + JSON.stringify(data));
        })
      );
  }

  addNotification(newNotification : INotification)
  {
    return this.http.post<INotification>(url, newNotification);
  }

  deleteNotification(id : number)
  {    
    return this.http.delete<INotification>(`${url}/${id}`);
  }


}
