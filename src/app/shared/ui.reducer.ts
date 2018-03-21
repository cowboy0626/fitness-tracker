import { UIActions, START_LOADING, STOP_LOADING } from './ui.action';

// 인터페이스 정의 
export interface State {
    isLoading: boolean;
};

// isLoading이 정의된 인터페이스를 구현하여 초기상태값 정의  
const initialState: State = {
    isLoading: false
};

// 액션타입에 따라 상태값 객체 반환하는 함수 (일종의 액션정책)
export function uiReducer(state = initialState, action: UIActions){

    switch (action.type) {
        case START_LOADING: 
            return {
                isLoading: true
            };
        case STOP_LOADING: 
            return {
                isLoading: false
            };
        default: 
            return state;
    }
}

// ??? 
export const getIsLoading = (state: State) => state.isLoading;
