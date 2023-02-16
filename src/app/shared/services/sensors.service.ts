import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISensor } from '../models/ISensor';

const apiUrl = environment.apiUrl;
const url = `${apiUrl}api/Sensors`;

@Injectable({
  providedIn: 'root'
})
export class SensorsService {

  constructor(private http: HttpClient) { }

  getSensors(): Observable<ISensor[]>
  {
    return this.http.get<ISensor[]>(url)
      .pipe(
        tap(data => {
          console.log('getSensors: ' + JSON.stringify(data));
        })
      );
  }

  getSensor(id : number): Observable<ISensor>
  {
    return this.http.get<ISensor>(`${url}/${id}`)
      .pipe(
        tap(data => {
          console.log('getSensor: ' + JSON.stringify(data));
        })
      );
  }

  addSensor(newSensor : ISensor)
  {
    return this.http.post<ISensor>(url, newSensor);
  }

  updateSensor(updatedSensor : ISensor)
  {
    return this.http.put<ISensor>(`${url}/${updatedSensor.id}`, updatedSensor);
  }

  deleteSensor(id : number)
  {
    return this.http.delete<ISensor>(`${url}/${id}`);
  }

  checkSensor(id : number)
  {
    return this.http.post(`${url}/check/${id}`, null);
  }
}
