import { TrainingService } from './../training/training.service';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { MatSnackBar } from '@angular/material';
import { UiService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  
  // private user: User; 임시로그인 처리를 위한 유저정보 저장소 
  private isAuthenticated = false; // firebase auth를 이용한 로그인여부 체크 
  
  // 툴바에서 로그인여부를 참조하기 위한 값
  authChange = new Subject<boolean>();
  
  
  // router를 inject하기 위해서 @Injectable이 사용됨 
  constructor(
    private router: Router, 
    private afAuth: AngularFireAuth, 
    private trainingService: TrainingService, 
    private snackBar: MatSnackBar, 
    private uiService: UiService
  ) { }

  // 로그인시 처리해야할 일 모으기 (앱처음시작할 때 사용함 - app.component) 
  initAuthListener(){
    this.afAuth.authState.subscribe(user => {
      if(user){
        // firebase 로그인처리 
        this.isAuthenticated = true;
        // 로그인상태가 변경되는 것을 감지 
        this.authChange.next(true);
        // 로그인 후 훈련화면으로 이동 
        this.router.navigate(['/training']);
      } else {
        // training serivce내 살아있을지 모르는 subscription 취소하기 
        this.trainingService.cancelSubscriptions();

        // this.user = null;
        // 로그인상태가 변경되는 것을 감지 
        this.authChange.next(false);

        this.router.navigate(['/login']);

        // firebase auth 처리 후 
        this.isAuthenticated = false;
      }
    });
  }
  
  registerUser(authData: AuthData){

    // 스피너처리 //로딩관련 이벤트 true
    this.uiService.loadingStateChanged.next(true);

    /* 예전방법 
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    } */

    this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => { 
        console.log(result);
        // this.authSuccessfully();
        this.uiService.loadingStateChanged.next(false);
      })
      .catch(error  => { 
        this.uiService.loadingStateChanged.next(false);
        // console.log(error);
        this.snackBar.open(error.message, null, {
          duration: 3000
        });
      });
    
  }

  login(authData: AuthData){

    // 스피너처리 //로딩관련 이벤트 true
    this.uiService.loadingStateChanged.next(true);

    /* 예전방법 
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    }
    this.authSuccessfully(); */

    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        // this.authSuccessfully();
        console.log(result);
        //로딩관련 이벤트 false
        this.uiService.loadingStateChanged.next(false);
      })
      .catch(error => {
        this.uiService.loadingStateChanged.next(false);
        // console.log(error);
        this.snackBar.open(error.message, null, {
          duration: 3000
        });
      });
  }

  logout(){

    this.afAuth.auth.signOut();

    // // training serivce내 살아있을지 모르는 subscription 취소하기 
    // this.trainingService.cancelSubscriptions();

    // // this.user = null;
    // // 로그인상태가 변경되는 것을 감지 
    // this.authChange.next(false);

    // this.router.navigate(['/login']);

    // // firebase auth 처리 후 
    // this.isAuthenticated = false;
  }

  getUser(){
    // 그냥 return 하면 참조값을 주기 때문에 외부에서 변경가능함. 값을 전달함 
    // return { ...this.user };
  }

  isAuth(){
    // return this.user != null;
    return this.isAuthenticated
  }


  // private authSuccessfully(){

    // // firebase 로그인처리 
    // this.isAuthenticated = true;

    // // 로그인상태가 변경되는 것을 감지 
    // this.authChange.next(true);

    // // 로그인 후 훈련화면으로 이동 
    // this.router.navigate(['/training']);

  // }

}
