import { createActions } from 'redux-actions';
import types from './types';

export const { addOrder, removeOrder, updateOrder, resetOrder} = createActions(
types.ADD,
types.REMOVE,
types.UPDATE,
types.RESET,
);
  