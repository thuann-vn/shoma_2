import {
    StoreReview
} from 'expo';
import Countries from '../constants/Countries';
import Currency from '../constants/Currency';
import {
    OrderServices
} from '../services/order';
import * as CountryData from 'country-region-data';
import R from 'ramda';

export const RequestReviewForm = () => {
    if (StoreReview.isSupported()){
        StoreReview.requestReview()
    }
}

/**
 * Get currency symbol
 * @param {*} currency 
 */
export const getCurrencySetting = (currency) => {
    const currencySetting = Currency[currency];
    return currencySetting;
}

/**
 * Get country by currency
 * @param {*} currency 
 */
export const getCountryByCurrency = (currency) => {
    const currencySetting = Currency[currency];
    if (currencySetting) {
        return Countries[currencySetting.country];
    }
    return Countries.US;
}

//Get order code
export const orderCodeShow = (prefix = 'DH', increment) => {
    return '#' + prefix + increment;
}


//Get font family
export const getFontFamily = (weight) => {
     var fontFamily = 'avenir-next';
     switch (weight) {
         case 'bold':
             fontFamily = 'avenir-next-bold';
             break;
         case 'cn':
             fontFamily = 'avenir-next-cn';
             break;
         case 'demi':
             fontFamily = 'avenir-next-demi';
             break;
         case 'it':
             fontFamily = 'avenir-next-it';
             break;
     }

     return fontFamily;
}

//Format number
export const formatChartNumber = (value, settings) =>{
    return value;
}

//Get country list
export const getCountries = () => {
    const replaceCountries = {
        'Vietnam': 'Việt Nam',
    }
    return R.map((item) => {
        return {
            label: replaceCountries[item.countryName] || item.countryName,
            value: replaceCountries[item.countryName] || item.countryName,
        };
    }, R.values(CountryData))
};

export const getCities = (countryName) => {
    const replaceCities = {
        'Hồ Chí Minh (Sài Gòn)': 'Hồ Chí Minh',
    }

    if (countryName == 'Việt Nam') {
        countryName = 'Vietnam';
    }
    var country = R.find(R.propEq('countryName', countryName), R.values(CountryData));
    if(country){
        return R.map((item) => {
            if(replaceCities)
             return {
                 label: replaceCities[item.name] || item.name,
                 value: replaceCities[item.name] || item.name,
             };
         }, country.regions);
    }

    return [];
}