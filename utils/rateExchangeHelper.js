export const getRateExchanges = (baseCurrency = 'EUR', callback) =>{
    fetch('http://data.fixer.io/api/latest?access_key=556a4a7f1863addf9fd468bf6cc9dcb4&base=' + baseCurrency).then(function(response){
        callback(response);
    })
}

export const getRate = (rateExchanges, baseCurrency, toCurrency = 'USD') => {
    if(baseCurrency == 'EUR'){
        return rateExchanges[toCurrency];
    }

    return 1 / rateExchanges[baseCurrency] * rateExchanges[toCurrency];
}

export const getValueByCurrency = (rateExchanges, value, toCurrency, fromCurrency = 'USD') => {
    return  value/getRate(rateExchanges, toCurrency, fromCurrency);
}