import R from 'ramda';
import { OrderStatus } from '../constants/Orders';
import moment from 'moment';

/**
 * Get order by id
 * @param {*} orders 
 * @param {*} id 
 */
export const getOrderById = (orders, id) => {
    return orders[id];
}

/**
 * Get increment orders id
 * @param {*} settings 
 */
export const getOrderIncrement = (settings, isDraft = false) =>{
    return (isDraft ? settings.orderDraftIncrement : settings.orderIncrement) + 1;
}

/**
 * Prepard order data
 * @param {*} order 
 */
export const prepareOrderData = (order, isDraft = false) =>{
    const {
        id,
        increment,
        items = {},
        customerId = null,
        shippingAddress = null,

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

        status = OrderStatus.draft,
        paymentStatus = OrderPaymentStatus.pending,

        shippingDate = null,
        paidDate = null,
        createdDate = new Date()
    } = order;

    var preparedShippingAddress = null;
    if(shippingAddress){        
        preparedShippingAddress = {
            name: shippingAddress.name || '',
            phoneNumber: shippingAddress.phoneNumber || '',
            email: shippingAddress.email || '',
            address: shippingAddress.address || '',
            address2: shippingAddress.address2 || '',
            city: shippingAddress.city || '',
            country: shippingAddress.country || '',
        }
    }

    //Prepare items
    let preparedItems = {};
    Object.keys(items).map((key)=>{
        const {
            name,
            image = null,
            price = 0,
            cost = 0,
            quantity
        } = items[key];

        preparedItems[key] = {
            id: key,
            name,
            image,
            price,
            cost,
            quantity
        }
    });

    return {
        id,
        increment,
        shippingAddress: preparedShippingAddress,
        items: preparedItems,
        customerId,

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
        
        isDraft: isDraft,
        status: isDraft === true || Object.keys(items).length == 0 ? OrderStatus.draft : status,
        paymentStatus,

        shippingDate: shippingDate? new Date(shippingDate) : null,
        paidDate: paidDate? new Date(paidDate) : null,
        createdDate: new Date(createdDate),
        isSynced: false,
    };
}

/**
 * Get shipping address
 */
export const getOrderShippingAddress = (shippingAddress) =>{
    if(shippingAddress){
        let address = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.country}`;
        if(shippingAddress.address2){
            address+= shippingAddress.address2 + ', ';
        }
        return address;
    }
    return '';
}

/**
 * Count draft orders
 */
export const countDraftOrders = (orders) =>{
    let count = 0;
    R.map((order) => !order.deleted && order.status == OrderStatus.draft && count++, R.values(orders));
    return count;
}

/**
 * Get total sell from date to date
 */
export const sumOrderByDate = (orders, from, to) => {
    let sum = 0;
    let count = 0;
    R.map((order) => {
        let createdDate = moment(order.createdDate);
        if (!order.deleted && order.status != OrderStatus.draft && createdDate.isSameOrAfter(from) && createdDate.isSameOrBefore(to)) {
            sum += order.total;
            count++;
        }
    }, R.values(orders));
    return {
        sum,count
    };
}


/**
 * Get order by item
 */
export const filterOrderByItem = (orders, itemId)=>{
    return R.filter((order) => {
        return !order.deleted && order.status != OrderStatus.draft && order.items && order.items[itemId];
     }, R.values(orders));
}

/**
 * Get order by customer
 */
export const filterOrderByCustomer = (orders, customerId) => {
    return R.filter((order) => {
        return !order.deleted && order.status != OrderStatus.draft && order.customerId == customerId;
    }, R.values(orders));
}
