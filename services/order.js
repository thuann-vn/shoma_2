import {
    getCollectionRef
} from './firebase';
const COLLECTION = 'orders';

export const OrderServices = {
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
        return getCollectionRef(COLLECTION).doc(data.id).set(data).catch(error => {
            console.log('Save order error', error);
        });
    },
    /**
     * @return {Promise}
     */
     remove: (id) => {
        return getCollectionRef(COLLECTION).doc(id).update({
            deleted: true
        });
     },

    /**
     * @return {Promise}
     */
     getOrderIncrement : (isDraft = false) => {
        return getCollectionRef(COLLECTION).where('isDraft', '==', isDraft).orderBy('increment', 'desc').limit(1).get().then((snapshot)=>{
            if (!snapshot.empty) {
                const doc = snapshot.docs[0].data();
                return doc.increment + 1;
            } else {
                return 10001;
            }
        }).catch(() => {
            return 10001;
        });
     }
}