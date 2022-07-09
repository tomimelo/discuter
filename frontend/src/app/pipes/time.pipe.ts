import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: Date): string {
    if (!value || !(value instanceof Date)) return '';
    const day = this.isToday(value) ? 'Today' : this.wasYesterday(value) ? 'Yesterday' : value.toLocaleDateString();
    const time = value.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false });
    return `${day} at ${time}`;
  }

  private wasYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.getDate() === date.getDate() && yesterday.getMonth() === date.getMonth() && yesterday.getFullYear() === date.getFullYear();
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return today.getDate() === date.getDate() && today.getMonth() === date.getMonth() && today.getFullYear() === date.getFullYear();
  }

}
