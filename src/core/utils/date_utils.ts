/**
 * @returns String with the current date in ISO format
 */
export const now = () => new Date().toISOString()

/**
 * @param date string, number or Date
 * @returns String with the current date in ISO format
 */
export const date = (date: string | number | Date = now()) => new Date(date).toISOString()

/**
 * @param date string, number or Date
 * @param dateToCompare string, number or Date
 * @returns boolean
 */
export const isBefore = (
    date: string | number | Date = now(),
    dateToCompare: string | number | Date
) => new Date(date) < new Date(dateToCompare)

/**
 *
 * @param date string, number or Date
 * @param dateToCompare string, number or Date
 * @returns boolean
 */
export const isAfter = (
    date: string | number | Date = now(),
    dateToCompare: string | number | Date
) => new Date(date) > new Date(dateToCompare)

type SetDate = {
    date?: string | number | Date
    time: string
}

/**
 * @returns String with the current date in ISO format
 * @param option Object with the date and the time to add in format '1m' (1 minute), '2h' (2 hours), '3d' (3 days), '4w' (4 weeks), '5M' (5 months), '6y' (6 years)
 */
export const setDate = (option: SetDate) => {
    const newDate = option.date ? new Date(option.date) : new Date()
    const { number, increment } = parseIncrement(option.time)

    if (increment === 'm') newDate.setMinutes(newDate.getMinutes() + number)
    if (increment === 'h') newDate.setHours(newDate.getHours() + number)
    if (increment === 'd') newDate.setDate(newDate.getDate() + number)
    if (increment === 'w') newDate.setDate(newDate.getDate() + number * 7)
    if (increment === 'M') newDate.setMonth(newDate.getMonth() + number)
    if (increment === 'y') newDate.setFullYear(newDate.getFullYear() + number)
    return newDate.toISOString()
}

/**
 * @param value string with the time to add in format '1m' (1 minute), '2h' (2 hours), '3d' (3 days), '4w' (4 weeks), '5M' (5 months), '6y' (6 years)
 * @returns Object with the number and the increment
 */
const parseIncrement = (value: string): { number: number; increment: string } => {
    const number = value.charAt(0)
    const increment = value.charAt(1)
    return { number: Number(number), increment }
}
