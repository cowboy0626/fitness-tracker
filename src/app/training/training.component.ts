import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {

  // 진행중 훈련
  ongoingTraining = false;

  // 변경된 훈련확인용 구독
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(ex => {
      if(ex){
        this.ongoingTraining = true;
      } else { 
        this.ongoingTraining = false;
      }
    });
  }

  ngOnDestroy(){
    this.exerciseSubscription.unsubscribe();
  }

}
