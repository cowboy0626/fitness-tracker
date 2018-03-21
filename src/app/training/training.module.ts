import { TrainingRoutingModule } from './training-routing.module';
import { SharedModule } from './../shared/shared.module';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { TrainingComponent } from './training.component';
import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { trainingReducer } from './training.reducer';

@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingComponent, 
        StopTrainingComponent
    ], 
    imports: [
        SharedModule, 
        TrainingRoutingModule, 
        StoreModule.forFeature('training', trainingReducer)// app.reducer에서 map이 사용되어 ui, auth와 같은 identifier를 제공한 것처럼 여기서는 'training'이라는 identifier를 제공하기 위해 forFeature를 사용함 
    ], 
    exports: [], 
    entryComponents: [StopTrainingComponent] // 다이얼로그에 의해서 나타나는 것으로 엔트리 포인트가 없기 때문에 지정
})

export class TrainingModule {}