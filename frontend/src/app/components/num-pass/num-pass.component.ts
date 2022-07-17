import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TuiInputNumberComponent } from '@taiga-ui/kit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-num-pass',
  templateUrl: './num-pass.component.html',
  styleUrls: ['./num-pass.component.scss']
})
export class NumPassComponent implements OnInit, OnDestroy {

  @ViewChildren('input') inputsList!: QueryList<TuiInputNumberComponent>;

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
    const digitControl = this.digitsControls[index] as FormControl
    const newValue = digitControl.value + value
    if (newValue < 0) {
      digitControl.setValue(9)
    } else if (newValue > 9) {
      digitControl.setValue(0)
    } else {
      digitControl.setValue(newValue)
    }
  }

  public onKeyUp(event: any, index: number) {
    if (!event.target) return
    const isEmpty = this.isEmpty(event.target.value)
    if (isEmpty) return
    const actualValue = event.target.value
    const pressedKey = event.key
    if (!this.isValidKey(pressedKey)) return
    if (actualValue !== pressedKey) {
      setTimeout(() => {
        this.replaceValue(index, pressedKey)
      }, 0)
    }
    const nextInput = this.inputsList.find((_, i) => i === index + 1)
    if (nextInput) {
      nextInput.nativeFocusableElement?.focus()
    }
  }

  private replaceValue(index: number, value: string) {
    this.digitsControls[index].setValue(Number(value))
  }

  private isValidKey(key: string): boolean {
    const keyParsedToNumber = parseInt(key)
    return !isNaN(keyParsedToNumber) && keyParsedToNumber >= 0 && keyParsedToNumber <= 9
  }

  private isEmpty(value: any): boolean {
    return !value || value.toString().trim().length === 0
  }

  private setDigitsControls(length: number) {
    this.numPassForm = new FormGroup({
      digits: new FormArray(Array.from({ length }, (_, i) => new FormControl(0)))
    })
    this.numPassForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((a) => {
      console.log(a);
      this.onDigitsChange.emit(this.getDigitsValue())
    })
  }

  private getDigitsValue(): string {
    return this.numPassForm.value.digits.map((digit: number) => `${digit}`).join('')
  }
}
