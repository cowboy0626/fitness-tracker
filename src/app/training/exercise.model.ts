
export interface Exercise {

    id: string;
    name: string;
    duration: number;
    calories: number;
    date?: Date; // 모든 연습이 날짜값이 있는 건 아니므로
    state?: 'completed' | 'cancelled' | null;

}