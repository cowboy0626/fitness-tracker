import { Store } from '@ngrx/store';
import { UiService } from './../../shared/ui.service';
import { TrainingService } from './../training.service';
import { Component, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

//firestore 
// import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 스피너처리
import * as fromRoot from '../../app.reducer';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {

  // 로딩스피너 처리 
  isLoading$: Observable<boolean>;

  exercises$: Observable<Exercise[]>;

  // private exerciseSubscription: Subscription;

  constructor(
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService, 
    private uiService: UiService
  ) { }

  ngOnInit() {
    // 로딩스피너처리 
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    // 데이터 변동있을 때 마다 다시 업데이트 
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
    //   // this.isLoading = false;
    //   this.exercises = exercises;
    // });
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);

    this.fetchExercises();
  }
  
  fetchExercises(){
    // 데이터 초기화 (가져오기)) 
    this.trainingService.fetchAvailableExercises();
  }

  // 트레이닝 시작하기 
  onStartTraining(form: NgForm){
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

}
