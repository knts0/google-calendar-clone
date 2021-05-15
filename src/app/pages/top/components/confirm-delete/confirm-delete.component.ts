import { Component, OnInit } from '@angular/core';
import { MatDialogRef }      from '@angular/material/dialog';


export type ConfirmDeleteResult = {
  isDelete: boolean
}

@Component({
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>
  ) { }

  ngOnInit(): void {
  }

  onCancel(): void {
    const result: ConfirmDeleteResult = { isDelete: false }
    this.dialogRef.close(result)
  }

  onDelete(): void {
    const result: ConfirmDeleteResult = { isDelete: true }
    this.dialogRef.close(result)
  }
}
