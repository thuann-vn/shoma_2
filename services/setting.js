import {
    getCollectionRef
} from './firebase';
const COLLECTION = 'settings';

export const SettingServices = {
    /**
     * @return {Promise}
     */
    getAllSettings: () => {
        return getCollectionRef(COLLECTION).get();
    },

    /**
     * @return {Promise}
     */
    get: (key) => {
        return getCollectionRef(COLLECTION).doc(key).get();
    },

    /**
     * @return {Promise}
     */
    set: (key, value) => {
        return getCollectionRef(COLLECTION).doc(key).set({value});
    },
}