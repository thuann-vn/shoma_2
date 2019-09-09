import R from 'ramda';
import { getNextId } from './stateHelper';
/**
 * Get list products
 * @param {*} id 
 * @param {bool} isIncome 
 */
export const getListProducts = (products) => {
    return R.filter((product) => {
        return !product.deleted;
    }, R.values(products));
}

/**
 * Get list product by category
 * @param {*} id 
 * @param {bool} isIncome 
 */
export const getProductByCategory = (products, id) => {
    return R.filter((product)=>{
        return product.category == id;
    },R.values(products));
}


/**
 * Prepare product data
 * @param {Object} props 
 * @return {Object}
 */
export const prepareProductData = (props) => {
     const {
         id = getNextId(),
         name,
         category = null,
         price = 0,
         comparePrice = 0,
         cost = 0,
         image = null,
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
         isSynced : false,
         order
     };
}