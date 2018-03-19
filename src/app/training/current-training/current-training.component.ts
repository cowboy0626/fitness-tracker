import { TrainingService } from './../training.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { StopTrainingComponent } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer;

  // 다이얼로그의 선택을 사용하기 위함 (이전은 컴포넌트에서 이벤트로 처리했지만 service에서 처리하게 바뀜)
  // @Output() trainingExit = new EventEmitter();


  constructor(private dialog: MatDialog, private trainingService: TrainingService) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }
  
  startOrResumeTimer(){

    // 짧은 실행시간을 가진 훈련은 시간이 빨리 가고 긴 훈련은 시간이 더디게 가게 만듦
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;

    this.timer = setInterval(() => {
      this.progress = this.progress + 5;
      if(this.progress >= 100){
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);

  }

  onStop(){
    clearInterval(this.timer);

    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      // '예'를 선택한 경우 진행 중인 훈련 없는 것으로 처리 (ongoingTraining = false) 
      if(result){
        // this.trainingExit.emit();
        this.trainingService.cancelExercise(this.progress);
      } else { 
        this.startOrResumeTimer();
      }

    });
  }

}
