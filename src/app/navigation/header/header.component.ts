import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { Observable } from 'rxjs';

import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isAuth$: Observable<boolean>;

  // 사이드메뉴토글용 
  @Output() sidenavToggle = new EventEmitter<void>();


  constructor(
    private store: Store<fromRoot.State>, 
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(fromRoot.getIsAuth);
  }
  
  onToggleSidenav(){
    this.sidenavToggle.emit();
  }
  
  onLogout(){
    this.authService.logout();
  }

}
