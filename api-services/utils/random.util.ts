export function randomISODateWithinDays(daysBack = 60): string {
  const now = new Date()
  const offset = Math.floor(Math.random() * daysBack) + 1
  now.setDate(now.getDate() - offset)
  now.setHours(10, 0, 0, 0) // fix เวลาให้ stable
  return now.toISOString()
}

export function randomVisitedAndDischargedDate(daysBack = 60) {
  const visitedAt = randomISODateWithinDays(daysBack)
  return {
    visited_at: visitedAt,
    discharged_at: visitedAt,
    billing_at: visitedAt
  }
}

export function randomISODateBetween(start: string | Date, end: string | Date, fixedHour = 10): string {
  const startDate = start instanceof Date ? start : new Date(start)
  const endDate = end instanceof Date ? end : new Date(end)

  const startTime = startDate.getTime()
  const endTime = endDate.getTime()

  if (startTime >= endTime) {
    throw new Error('start date must be before end date')
  }

  const randomTime = startTime + Math.random() * (endTime - startTime)

  const date = new Date(randomTime)

  date.setHours(fixedHour, 0, 0, 0)

  return date.toISOString()
}
