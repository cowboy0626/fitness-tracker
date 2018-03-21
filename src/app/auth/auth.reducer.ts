import { Action } from '@ngrx/store';

import { AuthActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';


// 상태 인터페이스 정의 
export interface State {
    isAuthenticated: boolean;
}

// 초기상태값 정의 
const initialState: State = {
    isAuthenticated: false
};

// 액션타입을 받아와서 정책화하는 리듀서함수 정의
export function authReducer(state = initialState, action: AuthActions){
    switch (action.type) {
        case SET_AUTHENTICATED: 
            return {
                isAuthenticated: true
            }
        case SET_UNAUTHENTICATED: 
            return { 
                isAuthenticated: false
            }
        default: {
            return state;
        }
            
    }
}

// 헬퍼 메서드 (상태값을 받아서 해당 상태의 isAuthenticated 값을 반환하는 함수)
export const getIsAuth = (state: State) => state.isAuthenticated;

