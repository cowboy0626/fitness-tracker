import { TrainingRoutingModule } from './training-routing.module';
import { SharedModule } from './../shared/shared.module';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { TrainingComponent } from './training.component';
import { NgModule } from '@angular/core';

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
        TrainingRoutingModule
    ], 
    exports: [], 
    entryComponents: [StopTrainingComponent] // 다이얼로그에 의해서 나타나는 것으로 엔트리 포인트가 없기 때문에 지정
})

export class TrainingModule {}