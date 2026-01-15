export class DateHelper {
  /**
   * Add months to a date string
   * @param dateStr - Date string in format DD/MM/YYYY HH:mm
   * @param months - Number of months to add
   * @returns Date string in format DD/MM/YYYY HH:mm
   */
  static addMonths(dateStr: string, months: number): string {
    const [datePart, timePart] = dateStr.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    
    const date = new Date(year, month - 1, day)
    date.setMonth(date.getMonth() + months)
    
    const newDay = String(date.getDate()).padStart(2, '0')
    const newMonth = String(date.getMonth() + 1).padStart(2, '0')
    const newYear = date.getFullYear()
    
    return timePart ? `${newDay}/${newMonth}/${newYear} ${timePart}` : `${newDay}/${newMonth}/${newYear}`
  }

  /**
   * Add days to a date string
   * @param dateStr - Date string in format DD/MM/YYYY HH:mm
   * @param days - Number of days to add
   * @returns Date string in format DD/MM/YYYY HH:mm
   */
  static addDays(dateStr: string, days: number): string {
    const [datePart, timePart] = dateStr.split(' ')
    const [day, month, year] = datePart.split('/').map(Number)
    
    const date = new Date(year, month - 1, day)
    date.setDate(date.getDate() + days)
    
    const newDay = String(date.getDate()).padStart(2, '0')
    const newMonth = String(date.getMonth() + 1).padStart(2, '0')
    const newYear = date.getFullYear()
    
    return timePart ? `${newDay}/${newMonth}/${newYear} ${timePart}` : `${newDay}/${newMonth}/${newYear}`
  }

  /**
   * Get current date in DD/MM/YYYY format
   */
  static getCurrentDate(): string {
    const date = new Date()
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    
    return `${day}/${month}/${year}`
  }
}