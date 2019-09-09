import moment from 'moment';

export const formatNumber = (globalize, number) => {
    const numberFormatter = globalize.getNumberFormatter({ minimumFractionDigits: 0, maximumFractionDigits: 2});
    return numberFormatter(number ? number : 0);
}

export const formatMoney = (globalize, number, currency = 'USD', hideCurrencySymbol = false) => {
    const currencyFormatter = globalize.getCurrencyFormatter(currency, { minimumFractionDigits: 0, maximumFractionDigits: 2, numberStyle: hideCurrencySymbol? 'accounting' : 'symbol' });
    return currencyFormatter(number ? number : 0);
}

export const formatDate = (date, format = 'YYYY/MM/DD') => {
    return moment(date).format(format);
}

export const formatMessage = (globalize, message, params) => {
    return globalize.getMessageFormatter(message)(params);
}