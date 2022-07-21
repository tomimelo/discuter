import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timer'
})
export class TimerPipe implements PipeTransform {

  transform(value: number): string {
    if (typeof value !== 'number') {
      throw new Error('Invalid value');
    }
    const seconds = `${value % 60}`.padStart(2, '0');
    const minutes = `${Math.floor(value / 60)}`.padStart(2, '0');

    return `${minutes}:${seconds}`;
  }

}
