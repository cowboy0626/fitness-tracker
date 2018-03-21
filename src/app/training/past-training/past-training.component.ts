// import { Subscription } from 'rxjs/Subscription';
import { TrainingService } from './../training.service';
import { Exercise } from './../exercise.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';

// store
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';


@Component({
  selector: 'app-past-training',
  templateUrl: './past-training.component.html',
  styleUrls: ['./past-training.component.css']
})
export class PastTrainingComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  dataSource = new MatTableDataSource<Exercise>();

  // private finishedExercisesSubscription: Subscription;

  // 소팅을 위한 처리 
  @ViewChild(MatSort) sort: MatSort;

  // 페이지네이팅 
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store: Store<fromTraining.State>,
    private trainingService: TrainingService
  ) { }

  ngOnInit() {
    /* 임시처리방법
    this.dataSource.data = this.trainingService.getCompletedOrCancelledExercises();
    */
    this.store.select(fromTraining.getFinishedExercises).subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    });
    // this.finishedExercisesSubscription = this.trainingService.finishedExercisesChanged
    //   .subscribe((exercises: Exercise[]) => {
    //     this.dataSource.data = exercises;
    //   });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }


  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // 필터링 
  doFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
