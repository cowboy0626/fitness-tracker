import { TrainingService } from './../training/training.service';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Injectable } from '@angular/core';
import { User } from './user.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { UiService } from '../shared/ui.service';
import { Store } from '@ngrx/store';

// 리듀서를 이용한 로딩스피너, 인증처리 
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.action';
import * as Auth from '../auth/auth.actions';

@Injectable()
export class AuthService {
  
  // router를 inject하기 위해서 @Injectable이 사용됨 
  constructor(
    private router: Router, 
    private afAuth: AngularFireAuth, 
    private store: Store<fromRoot.State>,
    private trainingService: TrainingService, 
    private uiService: UiService
  ) { }

  // 로그인시 처리해야할 일 모으기 (앱처음시작할 때 사용함 - app.component) 
  initAuthListener(){
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.store.dispatch(new Auth.SetAuthenticated()); // 클래스 생성자
        this.router.navigate(['/training']);
      } else {
        // training serivce내 살아있을지 모르는 subscription 취소하기 
        this.trainingService.cancelSubscriptions();

        // 비로그인상태 설정 
        this.store.dispatch(new Auth.SetUnauthenticated());
        this.router.navigate(['/login']);
      }
    });
  }
  
  registerUser(authData: AuthData){

    // 스피너처리 //로딩관련 이벤트 true (reducer를 이용하면서 감춤) 
    this.store.dispatch(new UI.StartLoading()); 

    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => { 
        this.store.dispatch(new UI.StopLoading()); 
      })
      .catch(error  => { 
        this.store.dispatch(new UI.StopLoading()); 
        this.uiService.showSnackBar(error.message, null, 3000);
      });
    
  }

  login(authData: AuthData){

    // 스피너처리 //로딩관련 이벤트 true
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => {
        console.log("@@@@ 로그인성공 : ",result);
        this.store.dispatch(new UI.StopLoading()); 
      })
      .catch(error => {
        console.log("@@@@ 로그인실패 : ", error);
        this.store.dispatch(new UI.StopLoading()); 
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  logout(){
    this.afAuth.auth.signOut();
  }


}
