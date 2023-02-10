import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISensor } from '../models/ISensor';
import { ISensorType } from '../models/ISensorType';

const apiUrl = environment.apiUrl;
const url = `${apiUrl}api/SensorTypes`;

@Injectable({
  providedIn: 'root'
})
export class SensorTypesService {

  constructor(private http: HttpClient) { }

  getSensorTypes(): Observable<ISensorType[]> 
  {
    return this.http.get<ISensorType[]>(url)
      .pipe(
        tap(data => {
          console.log('getSensorTypes: ' + JSON.stringify(data));
        })
      );
  }

  getSensorType(id : number): Observable<ISensorType> 
  {
    return this.http.get<ISensorType>(`${url}/${id}`)
      .pipe(
        tap(data => {
          console.log('getSensorType: ' + JSON.stringify(data));
        })
      );
  }

  addSensorType(newSensorType : ISensorType)
  {
    return this.http.post<ISensorType>(url, newSensorType);
  }

  updateSensorType(updatedSensorType : ISensorType)
  {
    return this.http.put<ISensorType>(`${url}/${updatedSensorType.id}`, updatedSensorType);
  }

  deleteSensorType(id : number)
  {    
    return this.http.delete<ISensorType>(`${url}/${id}`);
  }
  
}
