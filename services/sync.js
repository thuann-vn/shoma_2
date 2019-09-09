import {
    getCollectionRef
} from './firebase';
const COLLECTION = 'syncs';

export const SyncServices = {
    /**
     * @return {Promise}
     */
    getRef: () => {
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
        return getCollectionRef(COLLECTION).orderBy('name').get();
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