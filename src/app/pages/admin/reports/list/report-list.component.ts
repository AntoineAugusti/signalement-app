import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../../../services/report.service';
import { Report, StatusPro } from '../../../../model/Report';
import { UploadedFile } from '../../../../model/UploadedFile';
import { FileUploaderService } from '../../../../services/file-uploader.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  regions = [
    {
      label: 'Centre-Val de Loire',
      departments: [
        { code: '18', label: 'Cher' },
        { code: '28', label: 'Eure-et-Loir' },
        { code: '36', label: 'Indre' },
        { code: '37', label: 'Indre-et-Loire' },
        { code: '41', label: 'Loir-et-Cher' },
        { code: '45', label: 'Loiret' },
      ]
    },
    {
      label: 'Auvergne-Rhône-Alpes',
      departments: [
        { code: '01', label: 'Ain' },
        { code: '03', label: 'Allier' },
        { code: '07', label: 'Ardèche' },
        { code: '15', label: 'Cantal' },
        { code: '26', label: 'Drôme' },
        { code: '38', label: 'Isère' },
        { code: '42', label: 'Loire' },
        { code: '43', label: 'Haute-Loire' },
        { code: '63', label: 'Puy-de-Dôme' },
        { code: '69', label: 'Rhône' },
        { code: '73', label: 'Savoie' },
        { code: '74', label: 'Haute-Savoie' }
      ]
    }];

  reportsByDate: {date: string, reports: Array<Report>}[];
  totalCount: number;
  currentPage: number;
  itemsPerPage = 10;
  currentDepartment;

  constructor(private reportService: ReportService,
              private fileUploaderService: FileUploaderService,
              private router: Router) { }

  ngOnInit() {
    this.loadReports(1);
  }

  loadReports(page: number) {
    this.currentPage = page;
    this.reportService.getReports(
      (page - 1) * this.itemsPerPage,
      this.itemsPerPage,
      this.currentDepartment ? this.currentDepartment.code : undefined
    ).subscribe(result => {
      this.reportsByDate = [];
      const distinctDates = result.entities
        .map(e => moment(e.creationDate).format('DD/MM/YYYY'))
        .filter((date, index, self) => self.indexOf(date) === index);
      distinctDates.forEach(date => {
        this.reportsByDate.push(
          {
            date: date,
            reports: result.entities.filter(e => moment(e.creationDate).format('DD/MM/YYYY') === date)
          });
      });
      this.totalCount = result.totalCount;
    });
  }

  pageChanged(pageEvent: {page: number, itemPerPage: number}) {
    this.loadReports(pageEvent.page);
  }

  filterByDeparment(department?) {
    this.currentDepartment = department;
    this.loadReports(1);
  }

  getFileDownloadUrl(uploadedFile: UploadedFile) {
    return this.fileUploaderService.getFileDownloadUrl(uploadedFile);
  }

  openReport(report: Report) {
    this.router.navigate(['suivi-des-signalements', report.id]);
  }

  getReportCssClass(status: StatusPro) {
    let cssClass;
    switch (status) {
      case StatusPro['HORS-PERIMETRE']:
        cssClass = `hors-perimetre`;
        break;
      case StatusPro['A-CONTACTER']:
        cssClass = `a-contacter`;
        break;
      default:
        break;
    }
    return `${cssClass} pointer`;
  }
}
