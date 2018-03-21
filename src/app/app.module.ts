import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { AuthService } from './auth/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { StoreModule } from '@ngrx/store';


import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { TrainingService } from './training/training.service';
import { UiService } from './shared/ui.service';
import { reducers } from './app.reducer';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule, 
    BrowserAnimationsModule, 
    MaterialModule, 
    AppRoutingModule, 
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase), 
    AngularFirestoreModule,
    AuthModule, 
    StoreModule.forRoot(reducers)
  ],
  providers: [
    AuthService, 
    TrainingService, 
    UiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
