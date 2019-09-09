import { handleActions } from 'redux-actions';
import { insertAll, update, remove,  getById, insertWithUUID, insertAllWithUUID} from '../../utils/stateHelper';
import types from './types';
import faker from 'faker';

const createOrUpdateProduct = (props) => {
    const {
      id,
      name,
      category,
      price = 0,
      comparePrice = 0,
      cost,
      image,
      isSynced = false,
      order = 0,
    } = props;
  
    return {
      id, 
      name,
      category,
      price,
      comparePrice,
      cost,
      image,
      isSynced,
      order
    };
  };

var defaultProducts = [];
// for(var i=0; i < 50; i++){
//   defaultProducts.push({
//     name:  faker.commerce.productName(),
//     price: parseInt(faker.commerce.price(100000, 1000000)),
//     comparePrice: 0,
//     cost: 0,
//     isSynced:  true,
//   });
// }
  
const initialState = insertAllWithUUID({}, defaultProducts);

const productsReducer = handleActions({
[types.ADD]: (state, {
  payload
}) => insertWithUUID(state, createOrUpdateProduct(payload)),
[types.GET]:(state, { payload }) => getById(state, payload),
[types.UPDATE]: (state, { payload }) => update(state, payload.id, createOrUpdateProduct(payload)),
[types.REMOVE]: (state, { payload }) => remove(state, payload),
[types.RESET]: (state, { payload }) => state = payload ? payload : initialState,
}, initialState);

export default productsReducer;