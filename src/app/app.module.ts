import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MdToolbarModule, MdButtonModule, MdIconModule, MdDialogModule, MdInputModule, MdSidenavModule, MdCheckboxModule } from '@angular/material';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MdSlideToggleModule } from '@angular/material';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { ZoneComponent } from './components/zone/zone.component';
import { DialogComponents } from './components/dialogs';
import { HomeComponent } from './components/home/home.component';
import { ZoneInfoComponent } from './components/zone-info/zone-info.component';
import { TablesInfoComponent } from './components/tables-info/tables-info.component'
import { AgoPipe } from './pipes/ago.pipe';
import { WarnAgoPipe } from './pipes/warn-ago.pipe';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'admin', component: AdminComponent },
  { path: 'zone/:id', component: ZoneComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    ZoneComponent,
    HomeComponent,
    ZoneInfoComponent,
    TablesInfoComponent,
    AgoPipe,
    WarnAgoPipe,
    ...DialogComponents
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MdToolbarModule,
    MdButtonModule,
    MdIconModule,
    MdDialogModule,
    MdInputModule,
    MdSidenavModule,
    MdCheckboxModule,
    MdSlideToggleModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [
    ...DialogComponents
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
