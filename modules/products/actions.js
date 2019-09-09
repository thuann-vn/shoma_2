import { createActions } from 'redux-actions';
import types from './types';

export const { addProduct, removeProduct, updateProduct, getProduct, resetProduct} = createActions(
types.ADD,
types.REMOVE,
types.UPDATE,
types.GET,
types.RESET,
);
  