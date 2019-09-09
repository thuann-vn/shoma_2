import { handleActions } from 'redux-actions';
import { insertAll, update, remove, insertWithUUID, insertAllWithUUID } from '../../utils/stateHelper';
import types from './types';
import faker from 'faker';

const createOrUpdateCustomer = (props) => {
  const {
    id,
    name = '',
    phoneNumber = '',
    email = '',
    address = '',
    address2 = '',
    city = '',
    country = '',
    note = '',
    isHide = false,
    isSynced = false
  } = props;

  return {
    id, 
    name, 
    phoneNumber, 
    email,
    address,
    address2,
    city,
    country, 
    note,
    isHide, 
    isSynced
  };
};

let defaultCustomers = [];

// for(var i=0; i<30; i++){
//   defaultCustomers.push(
//     createOrUpdateCustomer({
//       name: faker.name.firstName() + ' ' + faker.name.lastName(),
//       phoneNumber: faker.phone.phoneNumber(),
//       email: faker.internet.email(),
//       address: faker.address.streetAddress(true),
//       city: faker.address.city(),
//       country: faker.address.country()
//     })
//   )
// }

const initialState = insertAllWithUUID({}, defaultCustomers);
const contactsReducer = handleActions({
  [types.ADD]: (state, { payload }) => insertWithUUID(state, createOrUpdateCustomer(payload)),
  [types.UPDATE]: (state, { payload }) => update(state, payload.id, createOrUpdateCustomer(payload)),
  [types.REMOVE]: (state, { payload }) => remove(state, payload),
  [types.RESET]: (state, { payload }) => state = payload ? payload : initialState,
}, initialState);

export default contactsReducer;