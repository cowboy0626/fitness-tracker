import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { TrainingService } from './training.service';

// 정책/로직가져오기 
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit{

  // 진행중 훈련
  ongoingTraining$: Observable<boolean>;

  // 변경된 훈련확인용 구독
  // exerciseSubscription: Subscription;

  constructor(
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
  }

}
