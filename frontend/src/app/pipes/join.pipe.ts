import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join'
})
export class JoinPipe implements PipeTransform {

  transform(value: any[], ...args: string[]): string {
    if (!Array.isArray(value)) return '';
    if (!args.length) return value.join(', ');
    const [field] = args;
    return value.map(item => item[field]).join(', ');
  }
}
