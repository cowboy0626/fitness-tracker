import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class UiService {

  constructor() { }

  loadingStateChanged = new Subject<boolean>();

}
