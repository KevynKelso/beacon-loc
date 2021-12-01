export function getCurrentTimestamp(): number {
  const d: number = Date.now()
  const date = new Date(d)

  return parseInt(`${String(date.getFullYear()).padStart(4, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`)
}

export function formatTimestamp(ts: number): string {
  if (ts.toString().length !== 14) {
    console.error("invalid timestamp", ts.toString().length)
    return "unknown"
  }
  // expecting timestamps in the form "20211119145525"
  // need to separate yyyy-mm-dd-HH-mm-ss
  const year: string = ts.toString().substring(0, 4)
  const month: string = ts.toString().substring(4, 6)
  const day: string = ts.toString().substring(6, 8)
  const hour: string = ts.toString().substring(8, 10)
  const min: string = ts.toString().substring(10, 12)
  const sec: string = ts.toString().substring(12, 14)

  return `${year}-${month}-${day} ${hour}:${min}:${sec}`
}

