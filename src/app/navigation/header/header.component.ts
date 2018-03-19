import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  // 사이드메뉴토글용 
  @Output() sidenavToggle = new EventEmitter<void>();

  // 로그인 표시 변경용 
  isAuth = false;

  // 메모리 누수방지 
  authSubscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {

    // subscription종료처리를 위해 subscribe로 받음 
    this.authSubscription = this.authService.authChange.subscribe(authState => {
      this.isAuth = authState;
    });

  }
  
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }
  
  ngOnDestroy(){
    // 메모리 누수를 방지하기 위해 subscribe가 종료되면 끝내야 함 
    this.authSubscription.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
  }

}
