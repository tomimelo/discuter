import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-num-pass',
  templateUrl: './num-pass.component.html',
  styleUrls: ['./num-pass.component.scss']
})
export class NumPassComponent implements OnInit, OnDestroy {

  @Input() set digits(value: number) {
    this._digits = value
    this.setDigitsControls(value)
  }
  private _digits: number = 3

  @Output() onDigitsChange = new EventEmitter<string>()
  public numPassForm!: FormGroup
  private destroy$ = new Subject<void>()

  get digitsControls(): FormControl[] {
    const digitsControl = this.numPassForm.get('digits') as FormArray
    return digitsControl.controls as FormControl[]
  }

  constructor() {
    this.setDigitsControls(this._digits)
  }

  public ngOnInit(): void {
  }

  public ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  public incrementDigit(index: number, value: number) {
    const digitsControl = this.numPassForm.get('digits') as FormArray
    const digitControl = digitsControl.controls[index] as FormControl
    const newValue = digitControl.value + value
    if (newValue < 0) {
      digitControl.setValue(9)
    } else if (newValue > 9) {
      digitControl.setValue(0)
    } else {
      digitControl.setValue(newValue)
    }
  }

  private setDigitsControls(length: number) {
    this.numPassForm = new FormGroup({
      digits: new FormArray(Array.from({ length }, (_, i) => new FormControl(0)))
    })
    this.numPassForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((a) => {
      this.onDigitsChange.emit(this.getDigitsValue())
    })
  }

  private getDigitsValue(): string {
    return this.numPassForm.value.digits.map((digit: number) => `${digit}`).join('')
  }
}
