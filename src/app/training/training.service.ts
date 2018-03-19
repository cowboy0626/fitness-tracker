import { AngularFirestore } from 'angularfire2/firestore';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';

// training component쪽으로 startExercise에 따른 이벤트를 전달하기 위함 (eventemitter 대신 Subject 사용함)
import { Subject } from 'rxjs/Subject';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {

  // 훈련상태 변경 이벤트 추적 (임시데이터 처리 경우) 
  exerciseChanged = new Subject<Exercise>();

  // 훈련상태 변경 이벤트 추적 (firestore이용하는 경우)
  exercisesChanged = new Subject<Exercise[]>();

  // 완료된훈련 변경이벤트 추적 
  finishedExercisesChanged = new Subject<Exercise[]>();

  /* 임시데이터 
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  ];*/
  private availableExercises: Exercise[] = [];

  // 현재 사용자가 진행중인 훈련 
  private runningExercise: Exercise;

  // observable이 남아 있을 경우 비인가 접속 시 에도 접속이나 데이터 이용이 가능함 
  // 비인가접속자에 대한 에러처리를 위해 subscription을 모두 담았다가 unsubscribe 처리를 하기 위함 
  // auth서비스에서 logout시 cancelSubscription처리하기 위함 
  private fbSubs: Subscription[] = [];

  // 훈련목록 (changed이벤트를 실제사용처에 넘기는 것으로 처리하므로 이것은 없어도 됨)
  // private exercises: Exercise[] = [];
  // private finishedExercises: Exercise[] = [];

  constructor(private db: AngularFirestore) { }

  // 임시데이터 조회용 
  getAvailableExercises(){
    return this.availableExercises.slice(); // slice를 사용하는 이유는 참조값을 주는 게 아니라 값을 주기위함 
  }
  // 실제데이터 조회용 
  fetchAvailableExercises(){
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          }
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        console.log(error);
      }));  
  }

  startExercise(selectedId: string){
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);

    // 상태정보 바뀐 훈련정보 전달 
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  getRunningExercise(){
    return { ...this.runningExercise };
  }
  
  /* 종료된 훈련조회 (임시)
  getCompletedOrCancelledExercises(){
    console.log(this.exercises);
    return this.exercises.slice();
  }*/

  // 종료된 실제훈련 조회
  fetchCompletedOrCancelledExercises(){
    // valueChanges는 id 정보없이 데이터만 조회됨 (조회용은 이것 사용하는게 낫다)
    // 에러 핸들링을 위해 subscription배열에 subscription을 넣음 
    this.fbSubs.push(this.db.collection('finishedExercises').valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // this.finishedExercises = exercises; // 이렇게 해도 되지만 changed subject를 이용해서 처리
        this.finishedExercisesChanged.next(exercises);
      }, error => {
        console.log(error);
      })); 
  }

  completeExercise(){

    // 훈련목록에 훈련상세 내용과 날짜, 상태를 추가해서 추가함 
    // this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed'});
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed'});

    // 초기화 
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number){

    // 훈련목록에 훈련상세 내용과 날짜, 상태를 추가해서 추가함 
    this.addDataToDatabase({ 
      ...this.runningExercise, 
      duration: this.runningExercise.duration * (progress / 100), 
      calories: this.runningExercise.calories * (progress / 100), 
      date: new Date(), 
      state: 'cancelled'
    });

    // 초기화 
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  // 실제 데이터 저장용 
  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise); // promise를 반환함
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }


}
