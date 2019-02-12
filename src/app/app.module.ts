import { NgtUniversalModule } from '@ng-toolkit/universal';
import { CommonModule } from '@angular/common';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './pages/header/header.component';
import { ReportComponent } from './pages/report/report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale, frLocale } from 'ngx-bootstrap';
import { FileInputComponent } from './components/file-input/file-input.component';
import { Ng2CompleterModule } from 'ng2-completer';
import { CompanyComponent } from './pages/report/company/company.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HowComponent } from './pages/infos/how/how.component';
import { AboutComponent } from './pages/infos/about/about.component';
import { RouterModule } from '@angular/router';
import { NgxLoadingModule } from 'ngx-loading';
import { Angulartics2Module } from 'angulartics2';
import { StatsComponent } from './pages/stats/stats.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DetailsComponent } from './pages/report/details/details.component';
import { BreadcrumbComponent } from './pages/report/breadcrumb/breadcrumb.component';
import { ConsumerComponent } from './pages/report/consumer/consumer.component';
import { ConfirmationComponent } from './pages/report/confirmation/confirmation.component';
import { SubcategoryComponent } from './pages/report/subcategory/subcategory.component';
import { PrecedeByPipe } from './pipes/precede-by.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { CollapsableTextComponent } from './components/collapsable-text/collapsable-text.component';

defineLocale('fr', frLocale);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ReportComponent,
    FileInputComponent,
    CompanyComponent,
    FooterComponent,
    HowComponent,
    AboutComponent,
    StatsComponent,
    DetailsComponent,
    BreadcrumbComponent,
    ConsumerComponent,
    ConfirmationComponent,
    SubcategoryComponent,
    CollapsableTextComponent,
    PrecedeByPipe,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    NgtUniversalModule,
    TransferHttpCacheModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BsDatepickerModule.forRoot(),
    NgxLoadingModule.forRoot({ primaryColour: '#003b80', secondaryColour: '#003b80', tertiaryColour: '#003b80' }),
    Ng2CompleterModule,
    Angulartics2Module.forRoot(),
    NgxEchartsModule,
    RouterModule.forRoot([
      { path: '', component: ReportComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'comment-ça-marche', component: HowComponent },
      { path: 'qui-sommes-nous', component: AboutComponent }
    ]),
  ],
  providers: [],
})
export class AppModule {
}
