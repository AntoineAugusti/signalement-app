import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Company, CompanySearchResult } from '../../model/Company';
import { CompanyService, MaxCompanyResult } from '../../services/company.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { RemoteData } from 'ng2-completer';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {

  searchForm: FormGroup;
  searchCtrl: FormControl;

  companyForm: FormGroup;
  nameCtrl: FormControl;
  addressCtrl: FormControl;

  companies: Company[];
  total: number;
  loading: boolean;
  showErrors: boolean;

  suggestionData: RemoteData;
  addressData: RemoteData;

  @Output() companySelected = new EventEmitter<Company>();

  constructor(private formBuilder: FormBuilder,
              private companyService: CompanyService,
              private addressService: AddressService) {

  }

  ngOnInit() {
    this.initSearchForm();
    this.initSearch();
  }

  initSearchForm() {
    this.searchCtrl = this.formBuilder.control('', Validators.required);
    this.searchForm = this.formBuilder.group({
      search: this.searchCtrl,
    });
    this.suggestionData = this.companyService.suggestionData;
  }

  initCompanyForm() {
    this.showErrors = false;
    this.nameCtrl = this.formBuilder.control('', Validators.required);
    this.addressCtrl = this.formBuilder.control('', Validators.required);
    this.companyForm = this.formBuilder.group({
      name: this.nameCtrl,
      address: this.addressCtrl,
    });
    this.addressData = this.addressService.addressData;
  }

  initSearch() {
    this.companies = [];
    this.total = 0;
  }

  searchCompany() {
    if (!this.searchForm.valid) {
      this.showErrors = true;
    } else {
      this.initSearch();
      this.loading = true;
      this.companyService.searchCompanies(this.searchCtrl.value).subscribe(
        companySearchResult => {
          this.loading = false;
          this.total = companySearchResult.total;
          if (this.total === 0) {
            this.treatCaseNoResult();
          } else if (this.total === 1) {
            this.treatCaseOneResult(companySearchResult);
          } else if (this.total > MaxCompanyResult) {
            this.treatCaseTooManyResults();
          } else {
            this.treatCaseManyResults(companySearchResult);
          }
        }
      );
    }
  }

  treatCaseNoResult() {
    this.searchCtrl.disable();
    this.initCompanyForm();
  }

  treatCaseOneResult(companySearchResult: CompanySearchResult) {
    this.selectCompany(companySearchResult.companies[0]);
  }

  treatCaseTooManyResults() {
    this.searchCtrl.disable();
    this.initCompanyForm();
  }

  treatCaseManyResults(companySearchResult) {
    this.companies = companySearchResult.companies;
  }

  selectCompany(company: Company) {
    this.companySelected.emit(company);
  }

  modifySearch() {
    this.companies = [];
    this.searchForm.controls['search'].enable();
    this.companyForm = null;
  }

  submitCompanyForm() {
    if (!this.companyForm.valid) {
      this.showErrors = true;
    } else {
      this.selectCompany(
        Object.assign(
          new Company(),
          {
            name: this.nameCtrl.value,
            line1: this.nameCtrl.value,
            line2: this.addressCtrl.value,
          }
        )
      );
    }
  }
}
