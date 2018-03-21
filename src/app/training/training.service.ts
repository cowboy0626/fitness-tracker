import { AngularFirestore } from 'angularfire2/firestore';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';

// training component쪽으로 startExercise에 따른 이벤트를 전달하기 위함 (eventemitter 대신 Subject 사용함)
import { Subject } from 'rxjs/Subject';

import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operators';

// 로딩스피너 
import { Store } from '@ngrx/store';
import { UiService } from './../shared/ui.service';
import * as UI from '../shared/ui.action'; // store에서 dispatch할 정책요소확인
// training관련 데이터처리 (forRoot를 상속한 training reducer) 
import * as Training from './training.actions';// store에서 dispatch할 정책요소확인 
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {

  // 훈련상태 변경 이벤트 추적 (임시데이터 처리 경우) 
  exerciseChanged = new Subject<Exercise>();

  // 훈련상태 변경 이벤트 추적 (firestore이용하는 경우)
  exercisesChanged = new Subject<Exercise[]>();

  // 완료된훈련 변경이벤트 추적 
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];

  // 현재 사용자가 진행중인 훈련 
  // private runningExercise: Exercise;

  // observable이 남아 있을 경우 비인가 접속 시 에도 접속이나 데이터 이용이 가능함 
  // 비인가접속자에 대한 에러처리를 위해 subscription을 모두 담았다가 unsubscribe 처리를 하기 위함 
  // auth서비스에서 logout시 cancelSubscription처리하기 위함 
  private fbSubs: Subscription[] = [];

  // 훈련목록 (changed이벤트를 실제사용처에 넘기는 것으로 처리하므로 이것은 없어도 됨)
  // private exercises: Exercise[] = [];
  // private finishedExercises: Exercise[] = [];

  constructor(
    private store: Store<fromTraining.State>,
    private db: AngularFirestore, 
    private uiService: UiService
  ) { }

  // 데이터 조회용 
  fetchAvailableExercises(){

    // 로딩스피너 처리 (dispatch는 function 호출함 select는 멤버객체를 호출함 )
    this.store.dispatch(new UI.StartLoading()); 

    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        // throw(new Error());
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          }
        });
      })
      .subscribe((exercises: Exercise[]) => {
        // 로딩스피너 닫기 
        this.store.dispatch(new UI.StopLoading());

        // 훈련데이터 가져오기 (예전방식)
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      }, error => {
        console.log(error);
        // 로딩스피너 닫기 
        this.store.dispatch(new UI.StopLoading());
        
        this.uiService.showSnackBar("훈련내용 조회에 에러가 발생하였습니다. 다시 시도해주세요", null, 3000);
        this.exercisesChanged.next(null); // 아무것도 없는 상태로 계속이동
      }));  
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
      // this.finishedExercisesChanged.next(exercises); // 이것도 옛날 방식 
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
    }, error => {
      console.log(error);
      this.uiService.showSnackBar(error.message, null, 3000);
    })); 
  }
  
  startExercise(selectedId: string){
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);

    // // 상태정보 바뀐 훈련정보 전달 
    // this.exerciseChanged.next({ ...this.runningExercise });
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise(){

    // 훈련목록에 훈련상세 내용과 날짜, 상태를 추가해서 추가함 
    // this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed'});
    // store를 이용해서 activeTraining을 찾아서 아래 로직실행 
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {

      this.addDataToDatabase({ ...ex, date: new Date(), state: 'completed'});
      // 초기화 (옛날방식)
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());
    });

  }

  cancelExercise(progress: number){

    // store이용 
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {

      // 훈련목록에 훈련상세 내용과 날짜, 상태를 추가해서 추가함 
      this.addDataToDatabase({ 
        ...ex, 
        duration: ex.duration * (progress / 100), 
        calories: ex.calories * (progress / 100), 
        date: new Date(), 
        state: 'cancelled'
      });
  
      // 초기화 
      // this.runningExercise = null;
      // this.exerciseChanged.next(null);
      this.store.dispatch(new Training.StopTraining());

    });

  }

  // 실제 데이터 저장용 
  private addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise); // promise를 반환함
  }

  cancelSubscriptions(){
    this.fbSubs.forEach(sub => sub.unsubscribe());
  }


}
