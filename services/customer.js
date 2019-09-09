import {
    getCollectionRef
} from './firebase';
const COLLECTION = 'customers';

export const CustomerServices = {
    /**
     * @return {Promise}
     */
    query: () => {
        return getCollectionRef(COLLECTION);
    },
    
    /**
     * @return {Promise}
     */
    get: (id) => {
        return getCollectionRef(COLLECTION).doc(id).get();
    },
    /**
     * @return {Promise}
     */
    list: () => {
        return getCollectionRef(COLLECTION).get();
    },
    /**
     * @return {Promise}
     */
    addOrUpdate: (data) => {
        return getCollectionRef(COLLECTION).doc(data.id).set(data);
    },
    /**
     * @return {Promise}
     */
     remove: (id) => {
        return getCollectionRef(COLLECTION).doc(id).update({
            deleted: true
        });
     }
}