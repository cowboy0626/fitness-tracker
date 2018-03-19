import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class UiService {

  constructor(private snackBar: MatSnackBar) { }

  loadingStateChanged = new Subject<boolean>();

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action, duration);
  }

}
