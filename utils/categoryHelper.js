import R from 'ramda';
import { OtherCategory } from '../constants/Categories';
import { getNextId } from './stateHelper';

export const getCategoryById = (categories, id) => {
    var result = null;
    R.map((category) => {
        if (category.id == id) {
            result = category;
        }
    }, categories);

    //If result null -> return empty
    if(!result){
        return getCategoryOther(categories);
    }
    
    return result;
}

export const getCategoryByCode = (categories, code) => {
    var result = null;
    R.map((category) => {
        if (category.code == code) {
            result = category;
        }
    }, categories);
    return result;
}

export const getMostUsedCategories = (categories) =>{
    return R.sort((a,b)=>{
        return a.usedTimes <= b.usedTimes 
    },R.values(categories));
}

/**
 * Get category named Other
 * @param {*} categories 
 * @param {bool} isIncome 
 */
export const getCategoryOther = (categories) => {
    var result = null;
    R.map((category) => {
        if(category.id){
            if (category.code == OtherCategory.code) {
                result = category;
            }
        }
    }, categories);
    return result;
}

/**
 * Get category named Other
 * @param {*} categories 
 * @param {bool} isIncome 
 */
export const getCategoryTransfer = (categories) => {
    var result = null;
    R.map((category) => {
         if (category.code == transferCategory.code) {
             result = category;
         }
    }, categories);
    return result;
}


/**
 * Get category named Other
 * @param {*} categories 
 * @param {bool} isIncome 
 */
export const getCategoryOrder = (categories) => {
    const sortedCategory =  R.sort((a,b) => {
        return a.order - b.order
    }, R.values(categories));

    return R.map(category => category.id, sortedCategory);
}
/**
 * Get list category
 * @param {*} categories  
 */
export const getCategoryList = (categories, activeOnly = false, exceptId = null) => {
    return R.filter((category) => {
        if (exceptId && category.id == exceptId){
            return false;
        }
        if (activeOnly && category.isHide) {
            return false;
        }

        return true;
    }, R.values(categories));
}

/**
 * Prepare category data
 * @param {Object} props 
 * @return {Object}
 */
export const prepareCategoryData = (props) => {
    const {
        id,
        code = '',
        name = '',
        image = null,
        parentCategory = null,
        isHide = false,
        order = 1,
    } = props;

    return {
        id,
        code,
        name,
        image,
        parentCategory,
        isHide,
        isSynced: false,
        order,
    };
}