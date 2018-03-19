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

  // @Output() trainingStart = new EventEmitter<void>();

  // 임시데이터처리 
  // exercises: Exercise[] = [];
  exercises: Exercise[];
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

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

    // 초기화 
    this.trainingService.fetchAvailableExercises();
    // 데이터 변동있을 때 마다 다시 업데이트 
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises => this.exercises = exercises);
  }

  ngOnDestroy(){
    this.exerciseSubscription.unsubscribe();
  }

  // 트레이닝 시작하기 
  onStartTraining(form: NgForm){
    // this.trainingStart.emit();
    this.trainingService.startExercise(form.value.exercise);
  }

}
