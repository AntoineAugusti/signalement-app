import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api, ServiceUtils } from './service.utils';
import { Report } from '../model/Report';
import moment from 'moment';
import { Company } from '../model/Company';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AnomalyService } from './anomaly.service';
import { isPlatformBrowser } from '@angular/common';
import { LocalStorage } from '@ngx-pwa/local-storage';

const ReportStorageKey = 'ReportSignalConso';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private reportSource = new BehaviorSubject<Report>(undefined);
  currentReport = this.reportSource.asObservable();

  isRetrievedFromStorage: boolean;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object,
              private http: HttpClient,
              private serviceUtils: ServiceUtils,
              private anomalyService: AnomalyService,
              private router: Router,
              private localStorage: LocalStorage) {

    this.retrieveReportFromStorage();

  }

  private retrieveReportFromStorage() {
    if (isPlatformBrowser(this.platformId) && !this.isRetrievedFromStorage) {
      this.localStorage.getItem(ReportStorageKey).subscribe((report) => {
        this.isRetrievedFromStorage = true;
        if (report) {
          report.fromStorage = true;
          this.reportSource.next(report);
        }
      });
    }
  }

  reinit() {
    this.router.navigate(['/']);
  }

  removeReportFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage.removeItemSubscribe(ReportStorageKey);
    }
  }

  changeReport(report: Report, step: Step) {
    report.fromStorage = false;
    this.reportSource.next(report);
    if (isPlatformBrowser(this.platformId)) {
      window.scroll(0, 0);
      if (report) {
        this.localStorage.setItemSubscribe(ReportStorageKey, report);
      } else {
       this.localStorage.removeItemSubscribe(ReportStorageKey);
      }
    }
    this.router.navigate([this.nextRoute(step)]);
  }

  backward(currentStep: Step) {
    const previousRoute = this.previousRoute(currentStep);
    if (previousRoute === ReportPaths.Category) {
      this.removeReportFromStorage();
    }
    this.router.navigate([previousRoute]);
  }

  nextRoute(currentStep: Step) {
    switch (currentStep) {
      case Step.Category:
        const anomaly = this.anomalyService.getAnomalyByCategory(this.reportSource.getValue().category);
        if (anomaly.information) {
          return ReportPaths.Information;
        } else if (anomaly.subcategories && anomaly.subcategories.length) {
          return ReportPaths.Subcategory;
        } else {
          return ReportPaths.Details;
        }
      case Step.Subcategory:
        if (this.reportSource.getValue().subcategory.information) {
          return ReportPaths.Information;
        } else {
          return ReportPaths.Details;
        }
      case Step.Details:
        return ReportPaths.Company;
      case Step.Company:
        return ReportPaths.Consumer;
      case Step.Consumer:
        return ReportPaths.Confirmation;
      case Step.Confirmation:
        return ReportPaths.Acknowledgment;
      default:
        return ReportPaths.Category;
    }
  }

  previousRoute(currentStep: Step) {
    switch (currentStep) {
      case Step.Subcategory:
        return ReportPaths.Category;
      case Step.Details:
        if (this.reportSource.getValue().subcategory) {
          return ReportPaths.Subcategory;
        } else {
          return ReportPaths.Category;
        }
      case Step.Company:
        return ReportPaths.Details;
      case Step.Consumer:
        return ReportPaths.Company;
      case Step.Confirmation:
        return ReportPaths.Consumer;
      default:
        return ReportPaths.Category;
    }
  }

  createReport(report: Report) {
    return this.http.post(
      this.serviceUtils.getUrl(Api.Report, ['api', 'reports']),
      this.generateReportFormData(report),
    );
  }

  private generateReportFormData(report: Report) {

    const reportFormData: FormData = new FormData();
    reportFormData.append('category', report.category);
    if (report.subcategory) {
      reportFormData.append('subcategory', report.subcategory.title);
    }
    if (report.details.precision) {
      reportFormData.append('precision', report.details.precision);
    }
    reportFormData.append('companyName', report.company.name);
    reportFormData.append('companyAddress', this.getCompanyAddress(report.company));
    reportFormData.append('companyPostalCode', report.company.postalCode);
    if (report.company.siret) {
      reportFormData.append('companySiret', report.company.siret);
    }
    reportFormData.append('anomalyDate', moment(report.details.anomalyDate).format('YYYY-MM-DD'));
    if (report.details.anomalyTimeSlot) {
      reportFormData.append('anomalyTimeSlot', report.details.anomalyTimeSlot.toString());
    }
    if (report.details.ticketFile) {
      reportFormData.append('ticketFile', report.details.ticketFile, report.details.ticketFile.name);
    }
    if (report.details.anomalyFile) {
      reportFormData.append('anomalyFile', report.details.anomalyFile, report.details.anomalyFile.name);
    }
    reportFormData.append('description', report.details.description);
    reportFormData.append('firstName', report.consumer.firstName);
    reportFormData.append('lastName', report.consumer.lastName);
    reportFormData.append('email', report.consumer.email);
    if (report.contactAgreement) {
      reportFormData.append('contactAgreement', report.contactAgreement.toString());
    }

    return reportFormData;
  }


  getCompanyAddress(company: Company) {
    let address = '';
    const addressAttibutes = ['line1', 'line2', 'line3', 'line4', 'line5', 'line6', 'line7'];
    if (company) {
      for (const attribute of addressAttibutes) {
        if (company[attribute]) {
          address = address.concat(`${company[attribute]} - `);
        }
      }
    }
    return address.substring(0, address.length - 3);
  }
}

export enum Step {
  Category = 'Category',
  Subcategory = 'Subcategory',
  Details = 'Details',
  Company = 'Company',
  Consumer = 'Consumer',
  Confirmation = 'Confirmation',
  Acknowledgment = 'Acknowledgment',
  Information = 'Information'
}


export enum ReportPaths {
  Category = '',
  Subcategory = 'signalement/le-probleme',
  Details = 'signalement/la-description',
  Company = 'signalement/le-commerçant',
  Consumer = 'signalement/le-consommateur',
  Confirmation = 'signalement/confirmation',
  Acknowledgment = 'signalement/accuse-de-reception',
  Information = 'signalement/information'
}
