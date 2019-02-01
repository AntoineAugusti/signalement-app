import { Injectable } from '@angular/core';
import { AnomalyList } from '../model/Anomaly';
import { HttpClient } from '@angular/common/http';
import { deserialize } from 'json-typescript-mapper';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  constructor(private http: HttpClient) { }

  getAnomalies() {

    return this.http.get('./assets/data/anomalies.json')
      .pipe(
        map(result => {
          return deserialize(AnomalyList, result).list;
        })
      );
  }

}
