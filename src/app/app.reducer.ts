
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUi from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';

// ui를 포함 상태값을 포함하는 인터페이스 정의 
export interface State {
    ui: fromUi.State;
    auth: fromAuth.State;
}

export const reducers: ActionReducerMap<State> = {
    ui: fromUi.uiReducer, 
    auth: fromAuth.authReducer
};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

// selector 정의 (그냥 직접 property에 접근해도 되는데, 도와 주는 것)
export const getAuthState = createFeatureSelector<fromAuth.State>('auth'); // state 전체를 받아오는 것 
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth); // help 메서드를 이용해 state 전체 중 특정 slice만 받아 오는 것