import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'readingTime',
})
export class ReadingTimePipe implements PipeTransform {
  /** Returns estimated reading time in minutes for the given word count. */
  transform(wordCount: number, wordsPerMinute = 200): number {
    return Math.ceil(wordCount / wordsPerMinute);
  }
}
