import { Consumer } from './Consumer';
import { Company } from './Company';
import { Subcategory } from './Anomaly';

export class Report {

  category: string;
  subcategory: Subcategory;
  company: Company;
  details: ReportDetails;
  consumer: Consumer;
  contactAgreement: boolean;
  internetPurchase: boolean;
  fromStorage: boolean;

}

export class ReportDetails {

  anomalyDate: Date;
  anomalyTimeSlot: number;
  description: string;
  ticketFile: File;
  anomalyFile: File;
  precision?: string;

}
