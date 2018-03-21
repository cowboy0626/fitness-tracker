import { Exercise } from './exercise.model';
import { Action } from '@ngrx/store';

// 4가지 액션 정의 
export const SET_AVAILABLE_TRAININGS = "[Training] Set Available Training";
export const SET_FINISHED_TRAININGS = "[Training] Set Finished Training";
export const START_TRAINING = "[Training] Start Training";
export const STOP_TRAINING = "[Training] Stop Training";


// 액션을 쉽게 쓰기위해 객체화 
export class SetAvailableTrainings implements Action {
    readonly type = SET_AVAILABLE_TRAININGS;
    // 이 클래스는 타입뿐만 아니라 내용도 전달해야 하므로 payload를 정의 한다. 
    constructor(public payload: Exercise[]){}
}

export class SetFinishedTrainings implements Action {
    readonly type = SET_FINISHED_TRAININGS;
    constructor(public payload: Exercise[]){}
}

export class StartTraining implements Action {
    readonly type = START_TRAINING;
    constructor(public payload: string){}
}

export class StopTraining implements Action {
    readonly type = STOP_TRAINING;
    // Active training을 죽이기 때문에 
}

export type TrainingActions = SetAvailableTrainings | SetFinishedTrainings | StartTraining | StopTraining; 