import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operator/map';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UiService } from '../../shared/ui.service';
import * as fromRoot from '../../app.reducer';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm: FormGroup;

  // 로그인 중 로딩스피너 처리 
  // isLoading = false;

  isLoading$: Observable<boolean>; // ngRx에 의해 컨트롤 되는 변수는 뒤에 $사인을 붙이는 컨벤션 있음 

  constructor(
    private authService: AuthService, 
    private uiService: UiService, 
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);


    // Reactive 방식으로 입력값 체크하기 
    this.loginForm = new FormGroup({
      email: new FormControl('', {validators: [Validators.required, Validators.email]}),
      password: new FormControl('', {validators: [Validators.required]})
    });
  }

  // Reducer를 이용하므로 subscription이 없어짐
  // ngOnDestroy(){
  //   if(this.loadingSubs){
  //     this.loadingSubs.unsubscribe();
  //   }
  // }

  onSubmit(){
    console.log("@@@@ 로그인처리 ");
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

}
