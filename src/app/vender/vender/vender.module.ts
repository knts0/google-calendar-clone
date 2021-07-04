import { NgModule } from '@angular/core'

// material
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatButtonModule }      from '@angular/material/button'
import { MatCheckboxModule }    from '@angular/material/checkbox'
import { MatDatepickerModule }  from '@angular/material/datepicker'
import { MatDialogModule }      from '@angular/material/dialog'
import { MatFormFieldModule }   from '@angular/material/form-field'
import { MatIconModule }        from '@angular/material/icon'
import { MatInputModule }       from '@angular/material/input'
import { MatSelectModule }      from '@angular/material/select'
import { MatSnackBarModule }    from '@angular/material/snack-bar'
import { DragDropModule }       from '@angular/cdk/drag-drop'
import { OverlayModule }        from '@angular/cdk/overlay'


const MATERIAL_MODULES = [
  // material
  MatBottomSheetModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  DragDropModule,
  OverlayModule,
]

@NgModule({
  declarations: [],
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
})
export class VenderModule { }
