import R from 'ramda';

/**
 * Get list customers
 * @param {*} id 
 * @param {bool} isIncome 
 */
export const getListCustomers = (customers) => {
    return R.filter((customer) => {
        return !customer.deleted;
    }, R.values(customers));
}

/**
 * Get customer by id
 * @param {*} customers 
 * @param {*} id 
 */
export const getCustomerById = (customers, id) => {
    return customers[id];
}

/**
 * Prepare customer data
 * @param {Object} props 
 * @return {Object}
 */
export const prepareCustomerData = (props) => {
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
        isSynced : false
    };
}