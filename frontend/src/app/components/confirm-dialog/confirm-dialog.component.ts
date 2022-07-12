import { Component, Inject, OnInit } from '@angular/core';
import { TuiDialogContext } from '@taiga-ui/core';
import {POLYMORPHEUS_CONTEXT} from '@tinkoff/ng-polymorpheus';

export interface ConfirmDialogContext {
  message: string;
  cancelText?: string;
  confirmText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  private defaultContext: Partial<ConfirmDialogContext> = {
    cancelText: 'Cancel',
    confirmText: 'Confirm'
  }

  public data: ConfirmDialogContext

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              private readonly context: TuiDialogContext<boolean, ConfirmDialogContext>) {
    this.data = {...this.defaultContext, ...context.data};
  }

  close(value: boolean): void {
    this.context.completeWith(value);
  }

}
