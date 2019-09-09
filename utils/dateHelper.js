import moment from 'moment';
import { DateRangeTypes } from '../constants/Common';
import { DateLocale } from '../globalize/dateLocale';

// Vietnamese locale
moment.defineLocale('vi', {
    ...DateLocale.vi,
    weekdaysParseExact: true,
    meridiemParse: /sa|ch/i,
    isPM: function (input) {
        return /^ch$/i.test(input);
    },
    meridiem: function (hours, minutes, isLower) {
        if (hours < 12) {
            return isLower ? 'sa' : 'SA';
        } else {
            return isLower ? 'ch' : 'CH';
        }
    },
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD/MM/YYYY',
        LL: 'D MMMM [năm] YYYY',
        LLL: 'D MMMM [năm] YYYY HH:mm',
        LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
        l: 'DD/M/YYYY',
        ll: 'D MMM YYYY',
        lll: 'D MMM YYYY HH:mm',
        llll: 'ddd, D MMM YYYY HH:mm'
    },
    calendar: {
        sameDay: '[Hôm nay lúc] LT',
        nextDay: '[Ngày mai lúc] LT',
        nextWeek: 'dddd [tuần tới lúc] LT',
        lastDay: '[Hôm qua lúc] LT',
        lastWeek: 'dddd [tuần rồi lúc] LT',
        sameElse: 'L'
    },
    relativeTime: {
        future: '%s tới',
        past: '%s trước',
        s: 'vài giây',
        ss: '%d giây',
        m: 'một phút',
        mm: '%d phút',
        h: 'một giờ',
        hh: '%d giờ',
        d: 'một ngày',
        dd: '%d ngày',
        M: 'một Tháng',
        MM: '%d Tháng',
        y: 'một năm',
        yy: '%d năm'
    },
    dayOfMonthOrdinalParse: /\d{1,2}/,
    ordinal: function (number) {
        return number;
    },
    week: {
        dow: 1, // Monday is the first day of the week.
        doy: 4  // The week that contains Jan 4th is the first week of the year.
    }
});

export const dateFormat = (date, format = 'YYYY/MM/DD', locale = 'en') => {
    return moment(date).locale(locale).format(format);
}

export const getStartOfMonth = (date) => {
    return moment(date).startOf('month').startOf('day');
}
export const getEndOfMonth = (date) => {
    return moment(date).endOf('month').endOf('day');
}

export const getMinuteDiff = (date1, date2) => {
    return Math.abs(moment(date1).diff(date2, 'minute'));
}

/**
 * Get date range type from 2 dates
 * If days diff <= 31 => daily
 * diff/7 < 12 =>  weekly (4 weeks is about a month -> 12 weeks is 3 months)
 * diff/
 * @param {*} from 
 * @param {*} to 
 */
export const getDateRangeType = (from, to) => {
    let daysDiff = moment(to).diff(from,'day');
    if(daysDiff<=31){
        rangeType= DateRangeTypes.daily;
    }else if(daysDiff/7 <= 12){
        rangeType= DateRangeTypes.weekly;
    }else if(daysDiff/30 <=12){
        rangeType= DateRangeTypes.monthly;
    }else{
        rangeType= DateRangeTypes.yearly;
    }
    return rangeType;
}


/**
 * Get timezone offset
 */
export const getTimezoneOffset = ()=>{
    var date = new Date();
    return date.getTimezoneOffset() / 60;
}