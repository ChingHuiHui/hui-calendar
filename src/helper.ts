export function getNumberOfDaysInAMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getDate(date: string): string {
  return new Date(date).getDate().toString()
}

export function fillZero(item: string | number): string {
  if (typeof item === 'number') {
    item = `${item}`
  }

  return item.padStart(2, '0')
}

export function formatDate(dateStr: string): string {
  const dateObj = new Date(dateStr)

  const year = dateObj.getFullYear()
  const month = fillZero(dateObj.getMonth() + 1)
  const date = fillZero(dateObj.getDate())

  return `${year}-${month}-${date}`
}
