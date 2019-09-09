export const Frequencies = {
    daily: 'daily',
    weekly: 'weekly',
    monthly: 'monthly',
    yearly: 'yearly'
}

export const RepeatOptions = {
    forever: 'forever',
    until: 'until',
    times: 'times'
}

export const EveryTexts = {
    daily: 'days',
    weekly: 'weeks',
    monthly: 'months',
    yearly: 'years'
}

export const DefaultRepeatOption = {
    frequency: Frequencies.monthly,
    every: 1,
    fromDate: new Date(),
    toDate: new Date(),
    repeatUntil: RepeatOptions.forever,
    repeatTimes: 1
}