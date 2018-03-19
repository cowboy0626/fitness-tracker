import { UiService } from './../../shared/ui.service';
import { TrainingService } from './../training.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';

//firestore 
// import { AngularFirestore } from 'angularfire2/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  // 로딩스피너 처리 
  isLoading = true;

  // @Output() trainingStart = new EventEmitter<void>();

  // 임시데이터처리 
  // exercises: Exercise[] = [];
  exercises: Exercise[];
  private exerciseSubscription: Subscription;
  private loadingSubs: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UiService) { }

  ngOnInit() {
    // 임시데이터 
    // this.exercises = this.trainingService.getAvailableExercises();
    // this.exercises = this.db.collection('availableExercises').snapshotChanges()
    //   .map(docArray => {
    //     return docArray.map(doc => {
    //       return { 
    //         id: doc.payload.doc.id,
    //         ...doc.payload.doc.data()
    //       }
    //     });
    //   });

    // 로딩스피너처리 
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    });

    // 데이터 변동있을 때 마다 다시 업데이트 
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => {
      // this.isLoading = false;
      this.exercises = exercises;
    });
    this.fetchExercises();
  }
  
  fetchExercises(){
    // 데이터 초기화 (가져오기)) 
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(){
    if(this.exerciseSubscription){
      this.exerciseSubscription.unsubscribe();
    }
    if(this.loadingSubs){
      this.loadingSubs.unsubscribe();
    }
  }

  // 트레이닝 시작하기 
  onStartTraining(form: NgForm){
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

}
