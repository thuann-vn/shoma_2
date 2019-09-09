import AsyncStorage from 'redux-persist/es/storage';
import { persistCombineReducers } from 'redux-persist';
import products from './products';
import categories from './categories';
import customers from './customers';
import orders from './orders';

import settings from './settings';
import rateExchanges from './rateExchanges';
import notifications from './notifications';
import syncs from './syncs';

const config = {
    key: 'root',
    whitelist: [
      'products',
      'categories',
      'customers',
      'orders',
      
      //Common
      'settings',
      'rateExchanges',
      'notifications',
      'syncs'
    ],
    storage: AsyncStorage,
  };

  
const appReducer = {
  products,
  categories, 
  customers,
  orders,

  //Common
  settings,
  rateExchanges,
  notifications,
  syncs
};

export default persistCombineReducers(config, appReducer);