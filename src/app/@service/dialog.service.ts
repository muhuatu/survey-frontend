import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  // 有確認取消可以按的警示框
  showDialogWithCallback(
    title: string,
    message: string,
    onConfirm: () => void
  ): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title, message, onConfirm },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        onConfirm();
      }
    });
  }

  // 簡單警示框
  showAlert(message: string): void {
    this.dialog.open(DialogComponent, {
      data: { title: 'Confirm', message },
      panelClass: 'custom-dialog', // 可選：為對話框添加自定義樣式類
    });
  }
}
