import { getCurrentTimestamp, formatTimestamp, replaceDateInTs, replaceTimeInTs } from "./timestamp"


test('current timestamp formatted correctly', () => {
  const timestamp: number = getCurrentTimestamp()

  expect(timestamp.toString().length).toEqual(14)
  // will fail in the year 2100
  expect(timestamp.toString().slice(0, 2)).toEqual('20')
})

test('hour offset', () => {
  // this test won't work at midnight
  const hourOffset: number = 1
  const timestamp: number = getCurrentTimestamp(hourOffset)

  expect(timestamp.toString().length).toEqual(14)
  // will fail in the year 2100
  expect(timestamp.toString().slice(0, 2)).toEqual('20')
  const date = new Date(Date.now())
  expect(timestamp.toString().slice(8, 10)).toEqual(String(date.getHours() + hourOffset))
})

test('invalid formatTimestamp', () => {
  const ts: number = 5
  const formattedTs: string = formatTimestamp(ts)
  expect(formattedTs).toEqual("unknown")
})

test('valid formatTimestamp output', () => {
  const ts: number = 20210106153300
  const formattedTs: string = formatTimestamp(ts)
  expect(formattedTs).toEqual("2021-01-06 15:33:00")
})

test('successful date insertion', () => {
  const date: string = "2022-01-06"
  const ts: number = 99999999153300
  const newTimestamp: number = replaceDateInTs(date, ts)

  expect(newTimestamp.toString().length).toEqual(14)
  expect(newTimestamp.toString().slice(0, 8)).toEqual("20220106")
})

test('successful time insertion', () => {
  const time: string = "15:33:00"
  const ts: number = 20220106153300
  const newTimestamp: number = replaceTimeInTs(time, ts)

  expect(newTimestamp.toString().length).toEqual(14)
  expect(newTimestamp.toString().slice(8, 14)).toEqual("153300")
})
