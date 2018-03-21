import { Exercise } from './exercise.model';
import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import { TrainingActions, SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING } from './training.actions';

import * as fromRoot from '../app.reducer';

// 인터페이스 정의 
export interface TrainingState { 
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}

// 근데 training은 lazy loading되는 항목임 / lazy loading 후 사용되는 글로벌 State 
// ui 관련기능 (로딩 스피너 등) 사용하기 위해서 extends fromRoot.State함
export interface State extends fromRoot.State {
    training: TrainingState;
}

// 초기상태값 설정 
const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises:[], 
    activeTraining: null
};

// 정책함수 정의 
export function trainingReducer(state = initialState, action: TrainingActions){

    switch(action.type){
        case SET_AVAILABLE_TRAININGS: 
            return {
                ...state, 
                availableExercises: action.payload // 1개 이상의 property를 가지므로 오버라이딩 
            }
        case SET_FINISHED_TRAININGS: 
            return { 
                ...state, 
                finishedExercises: action.payload
            }
        case START_TRAINING: 
            return {
                ...state, 
                activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload) }
            }
        case STOP_TRAINING: 
            return {
                ...state,
                activeTraining: null
            }
        default: 
            return state;
    }
}

// training.module의 forFeature가 사용할 셀렉터를 위한 헬퍼함수 정의 (이게 전체 state slice에 접근하고 아래 것 3개는 추가로 접근하게 함)
export const getTrainingState = createFeatureSelector<TrainingState>('training'); // 'training'은 training.module에서 forFeature에서 사용된 식별자와 같아야 함 

// 헬퍼함수 정의 (실제 외부에서 사용하는 것) > 근데 이걸 위에 있는 getTrainingState함수를 이용해서 사용함 
export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);