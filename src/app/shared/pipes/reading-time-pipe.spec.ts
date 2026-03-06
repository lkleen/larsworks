import { ReadingTimePipe } from './reading-time-pipe';

describe('ReadingTimePipe', () => {
  const pipe = new ReadingTimePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns 1 min for 200 words or fewer', () => {
    expect(pipe.transform(100)).toBe(1);
    expect(pipe.transform(200)).toBe(1);
  });

  it('rounds up to the nearest minute', () => {
    expect(pipe.transform(201)).toBe(2);
    expect(pipe.transform(400)).toBe(2);
    expect(pipe.transform(401)).toBe(3);
  });

  it('supports custom words-per-minute', () => {
    expect(pipe.transform(300, 100)).toBe(3);
  });
});
