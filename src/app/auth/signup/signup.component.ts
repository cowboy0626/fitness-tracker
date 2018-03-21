import { Observable } from 'rxjs';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UiService } from '../../shared/ui.service';

// 상태값에 따른 액션처리 
import { Store } from '@ngrx/store';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  maxDate;
  isLoading$: Observable<boolean>;

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService, 
    private uiService: UiService
  ) { }

  ngOnInit() {

    // 정책Store로부터 로딩상태 확인  
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(form: NgForm) {
    console.log(form);
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
    })
  }


}
