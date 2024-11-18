import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogTitle,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogTitle,
    MatDialogActions,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
})
export class DialogComponent {
  readonly dialogRef = inject(MatDialogRef<DialogComponent>);
  readonly data = inject<any>(MAT_DIALOG_DATA);
  // 當你要關閉這個對話框時就使用dialogRef的方法close()，
  // 來觸發關閉並且可以在()內放入你要回傳的內容。
  onNoClick(): void {
    let returnData = ['aaa', 'bbb'];
    this.dialogRef.close(returnData);
  }
  close() {
    this.dialogRef.close();
  }
}
