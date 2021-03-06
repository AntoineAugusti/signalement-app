import { Injectable } from '@angular/core';
import anomalies from '../../assets/data/anomalies.json';
import { Anomaly } from '../model/Anomaly';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  anomalies: Anomaly[];

  constructor() {
    this.anomalies = this.getAnomalies();
  }

  getAnomalies() {
    if (!this.anomalies) {
      this.anomalies = anomalies.list;
    }
    return this.anomalies;
  }

  getAnomalyBy(predicate: (anomaly) => boolean) {
    return this.getAnomalies()
      .find(predicate);
  }

  getAnomalyByCategory(category: String) {
    return this.getAnomalyBy(anomaly => anomaly.category === category);
  }

  getAnomalyByCategoryId(categoryId: String) {
    return this.getAnomalyBy(anomaly => anomaly.categoryId === categoryId);
  }

}
