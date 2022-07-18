import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
@Component({
  selector: 'app-num-pass',
  templateUrl: './num-pass.component.html',
  styleUrls: ['./num-pass.component.scss']
})
export class NumPassComponent {

  @ViewChildren('input') inputsList!: QueryList<ElementRef>;

  @Input() set digits(value: number) {
    this._digits = value
    this.setDigitsPlaceholders(value)
  }
  @Input() disabled: boolean = false
  private _digits: number = 3

  @Output() onDigitsChange = new EventEmitter<string>()
  @Output() onDigitsComplete = new EventEmitter<string>()
  public inputsPlaceholder: string[] = new Array(this._digits).fill('0')

  constructor() {
    this.setDigitsPlaceholders(this._digits)
  }

  public incrementDigit(index: number, value: number) {
    const targetedInput = this.inputsList.get(index)!.nativeElement
    const newValue = Number(targetedInput.value) + value
    if (newValue < 0) {
      this.setInputValue(index, '9')
    } else if (newValue > 9) {
      this.setInputValue(index, '0')
    } else {
      this.setInputValue(index, newValue.toString())
    }
  }

  public onPaste(event: any) {
    event.preventDefault()
  }

  public onKeyDown(event: any, index: number) {
    event.preventDefault()
    const input = event.target
    const pressedKey = event.key
    if (this.isEnterKey(event)) {
      this.onDigitsComplete.emit(this.getDigitsValue())
      return
    }
    if (this.isBackspaceKey(event)) {
      this.setInputValue(index, "")
      const previousInput = this.inputsList.get(index - 1)
      if (previousInput) {
        previousInput.nativeElement.focus()
      }
      return
    }
    if (!this.isValidKey(pressedKey)) return
    this.setInputValue(index, pressedKey)
    const nextInput = this.inputsList.get(index + 1)
    if (nextInput) {
      nextInput.nativeElement.focus()
    }
  }

  private setInputValue(index: number, value: string) {
    this.inputsList.get(index)!.nativeElement.value = value
    this.onDigitsChange.emit(this.getDigitsValue())
  }

  private isValidKey(key: string): boolean {
    const keyParsedToNumber = parseInt(key)
    return !isNaN(keyParsedToNumber) && keyParsedToNumber >= 0 && keyParsedToNumber <= 9
  }

  private isBackspaceKey(event: any): boolean {
    return (event.key && event.key.toLowerCase() === 'backspace') || (event.keyCode && event.keyCode === 8);
  }

  private isEnterKey(event: any): boolean {
    return (event.key && event.key.toLowerCase() === 'enter') || (event.keyCode && event.keyCode === 13);
  }

  private setDigitsPlaceholders(length: number) {
    this.inputsPlaceholder = new Array(length).fill('0')
  }

  private getDigitsValue(): string {
    return this.inputsList.map(input => input.nativeElement.value).join('')
  }
}
