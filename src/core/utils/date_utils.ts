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

    const { number, period } = (option.time.match(/^(?<number>\d{1,2})(?<period>[smhdwMy]{1})/s)
        ?.groups as { number: string; period: string }) || { number: '0', period: 'm' }

    if (period === 'm') newDate.setMinutes(newDate.getMinutes() + Number(number))
    if (period === 'h') newDate.setHours(newDate.getHours() + Number(number))
    if (period === 'd') newDate.setDate(newDate.getDate() + Number(number))
    if (period === 'w') newDate.setDate(newDate.getDate() + Number(number) * 7)
    if (period === 'M') newDate.setMonth(newDate.getMonth() + Number(number))
    if (period === 'y') newDate.setFullYear(newDate.getFullYear() + Number(number))
    return newDate.toISOString()
}
