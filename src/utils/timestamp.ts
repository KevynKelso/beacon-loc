// generates timestamp in the form of "yyyymmddHHMMss" e.g. "20211119145525"
export function getCurrentTimestamp(hourOffset?: number): number {
  const d: number = Date.now()
  const date = new Date(d)

  if (hourOffset) {
    date.setHours(date.getHours() + hourOffset)
  }

  return parseInt(`${String(date.getFullYear()).padStart(4, '0')}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`)
}

export function formatTimestamp(ts: number): string {
  if (ts === 0) return "The big bang"
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

export function replaceDateInTs(date: string, ts: number): number {
  date = date.replaceAll('-', '')
  const tsString: string = ts.toString()
  const newTs: string = tsString.replace(tsString.substring(0, 8), date)

  return parseInt(newTs, 10)
}

export function replaceTimeInTs(date: string, ts: number): number {
  date = date.replaceAll(':', '')
  const tsString: string = ts.toString()
  const newTs: string = tsString.replace(tsString.substring(8, 14), date)

  return parseInt(newTs, 10)
}
