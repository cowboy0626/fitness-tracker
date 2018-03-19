import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'app-stop-training',
    template: `
        <h1 mat-dialog-title>중지하시겠습니까? </h1>
        <mat-dialog-content>
            <p>You already got {{ passedData.progress }}%</p>
        </mat-dialog-content>
        <mat-dialog-actions>
            <button mat-button [mat-dialog-close]="true">예</button>
            <button mat-button [mat-dialog-close]="false">아니오</button>
        </mat-dialog-actions>
    `
})

export class StopTrainingComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public passedData: any){

    }
}