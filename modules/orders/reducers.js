import { handleActions } from 'redux-actions';
import { insertAll, update, remove,  getById, insertWithUUID} from '../../utils/stateHelper';
import types from './types';
import { OrderDiscountTypes, OrderStatus, OrderPaymentStatus } from '../../constants/Orders';

const createOrUpdateOrder = (props) => {
    const {
      id,
      increment,
      items = {},
      customerId = null,
      shippingAddress = {},

      subTotal = 0,
      shippingFee = 0,
      discountType = OrderDiscountTypes.none,
      discountValue = 0,
      discountPercent = 0,
      discountTotal = 0,
      discountReason = '',
      total = 0,

      shipmentTrackingCode = '',
      shipmentCarrier = '',
      shipmentNote = '',

      isDraft = true,
      status = OrderStatus.draft,
      paymentStatus = OrderPaymentStatus.pending,

      shippingDate = null,
      paidDate = null,
      createdDate = new Date(),
      isSynced = false
    } = props;
  
    return {
      id,
      increment,
      items,
      customerId,
      shippingAddress,

      subTotal,
      shippingFee,
      discountType,
      discountValue,
      discountPercent,
      discountTotal,
      discountReason,
      total,

      shipmentTrackingCode,
      shipmentCarrier,
      shipmentNote,

      isDraft,
      status,
      paymentStatus,

      shippingDate,
      paidDate,
      createdDate,
      isSynced
    };
  };

const initialState = insertAll({}, []);
const ordersReducer = handleActions({
[types.ADD]: (state, { payload }) => insertWithUUID(state, createOrUpdateOrder({
    ...payload,
    balance: payload.initialBalance,
})),
[types.GET]:(state, { payload }) => getById(state, payload),
[types.UPDATE]: (state, { payload }) => update(state, payload.id, createOrUpdateOrder(payload)),
[types.REMOVE]: (state, { payload }) => remove(state, payload),
[types.RESET]: (state, { payload }) => state = payload ? payload : initialState,
}, initialState);

export default ordersReducer;