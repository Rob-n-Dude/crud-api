export function* roundRobin(maxValue: number): Iterator<number> {
  let index = 0
  while (true) {
    yield index
    index = index + 1 >= maxValue ? 0 : index + 1
  }
}
