import { TrainingComponent } from './training.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
    // path가 상위에서 받아 오므로 ''임. 
    { path: '', component: TrainingComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ], 
    exports: [RouterModule]
})

export class TrainingRoutingModule {}