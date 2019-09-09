import { createActions } from 'redux-actions';
import types from './types';

export const { addCustomer, removeCustomer, updateCustomer, getCustomer, resetCustomer} = createActions(
types.ADD,
types.REMOVE,
types.UPDATE,
types.GET,
types.RESET,
);
  