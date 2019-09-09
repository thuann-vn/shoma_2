import SyncTypes from "../constants/SyncTypes";
import {
	categoriesTypes
} from "../modules/categories";
import v1 from 'uuid';

import Constants from 'expo-constants';
import {
	ordersTypes} from '../modules/orders';
import {
	SyncServices
} from '../services/sync';
import {
	CategoryServices
} from '../services/category';
import {
	productsTypes
} from '../modules/products';
import {
	ProductServices
} from '../services/product';
import {
	OrderServices
} from '../services/order';
import {
	customersTypes
} from '../modules/customers';
import {
	CustomerServices
} from '../services/customer';
import {
	DeviceServices
} from '../services/devices';
import { addProduct, updateProduct, removeProduct } from "../modules/products/actions";
import { updateCategory, addCategory, removeCategory } from "../modules/categories/actions";
import { updateOrder, addOrder, removeOrder } from "../modules/orders/actions";
import { removeCustomer, updateCustomer, addCustomer } from "../modules/customers/actions";

//Middleware
export function firebaseSyncMiddleware() {
	return next => async action => {
		const {
			type,
			payload
		} = action;
		let relatedId = typeof payload == 'object' ? payload.id : payload;

		/**
		 * This variable to check must sync to firebase,
		 * every payload must have a isSynced flag to tell that sync to firestore
		 * if isSynced not defined => data not sync to cloud
		 */
		let isMustSync = typeof payload == 'object' ? !payload.isSynced : false;

		//Set timeout
		setTimeout(()=>{
			//Save change to store
			if (isMustSync) {
				var isSyncItem = false;
				switch (type) {
					//Categories
					case categoriesTypes.ADD:
					case categoriesTypes.UPDATE:
						CategoryServices.addOrUpdate(payload);
						isSyncItem = true;
						syncType = SyncTypes.category;
						break;
					case categoriesTypes.REMOVE:
						CategoryServices.remove(payload.id);
						isSyncItem = true;
						syncType = SyncTypes.category;
						break;

						//Products
					case productsTypes.ADD:
					case productsTypes.UPDATE:
						ProductServices.addOrUpdate(payload);
						isSyncItem = true;
						syncType = SyncTypes.product;
						break;
					case productsTypes.REMOVE:
						ProductServices.remove(payload.id);
						isSyncItem = true;
						syncType = SyncTypes.product;
						break;

						//Orders
					case ordersTypes.ADD:
					case ordersTypes.UPDATE:
						OrderServices.addOrUpdate(payload);
						syncType = SyncTypes.order;
						isSyncItem = true;
						break;
					case ordersTypes.REMOVE:
						OrderServices.remove(payload.id);
						syncType = SyncTypes.order;
						isSyncItem = true;
						break;

						//Customer
					case customersTypes.ADD:
					case customersTypes.UPDATE:
						CustomerServices.addOrUpdate(payload);
						syncType = SyncTypes.customer;
						isSyncItem = true;
						break;
					case customersTypes.REMOVE:
						CustomerServices.remove(payload.id);
						syncType = SyncTypes.customer;
						isSyncItem = true;
						break;
				}

				//Save sync log
				if (isSyncItem && !payload.isSynced) {
					DeviceServices.list().then(snapshot => {
						var devices = {};
						snapshot.forEach(doc => {
							const device = doc.data();
							if (device.id != Constants.deviceId) {
								devices[device.id] = false;
							}
						});
						if (Object.keys(devices).length > 0) {
							const syncData = {
								id: v1(),
								actionType: type,
								syncType: syncType,
								relatedId: relatedId,
								deviceId: Constants.deviceId,
								syncedDevices: devices,
								date: new Date()
							}
							SyncServices.addOrUpdate(syncData);
						}
					})

				}
			}
		})
		return next(action);
	};
}


//Listen to child add event -> sync with firebase
/**
 * 
 * @param {import("redux").Store} store 
 */
export const syncDataAndListen = (store) => {
	let isSyncing = false;
	let syncingSnapshot = SyncServices.getRef().where("syncedDevices." + Constants.deviceId, "==", false).onSnapshot((snapshot) => {
		if (isSyncing) {
			return;
		};
		if (!snapshot.empty){
			isSyncing = true;
			snapshot.forEach(function (doc) {
				if (doc && doc.exists) {
					var syncData = doc.data();
					//Update data
					switch (syncData.actionType) {
						case productsTypes.ADD:
						case productsTypes.UPDATE:
							ProductServices.get(syncData.relatedId).then(itemDoc => {
								if (itemDoc && itemDoc.exists) {
									let product = {
										...itemDoc.data(),
										isSynced: true
									}
									if (syncData.actionType == productsTypes.UPDATE) {
										store.dispatch(updateProduct(product));
									} else {
										store.dispatch(addProduct(product));
									}
								}
							});
							break;
						case productsTypes.REMOVE:
							store.dispatch(removeProduct({
								id: syncData.relatedId,
								isSynced: true
							}));
							break;
						case categoriesTypes.ADD:
						case categoriesTypes.UPDATE:
							CategoryServices.get(syncData.relatedId).then(itemDoc => {
								if (itemDoc && itemDoc.exists) {
									let category = {
										...itemDoc.data(),
										isSynced: true
									}

									if (syncData.actionType == categoriesTypes.UPDATE) {
										store.dispatch(updateCategory(category));
									} else {
										store.dispatch(addCategory(category));
									}
								}
							});
							break;
						case categoriesTypes.REMOVE:
							store.dispatch(removeCategory({
								id: syncData.relatedId,
								isSynced: true
							}));
							break;
						case ordersTypes.ADD:
						case ordersTypes.UPDATE:
							OrderServices.get(syncData.relatedId).then(itemDoc => {
								if (itemDoc && itemDoc.exists) {
									let order = {
										...itemDoc.data(),
										isSynced: true
									}

									//Prepare data
									order.createdDate = order.createdDate.toDate();
									order.shippingDate = order.shippingDate ? order.shippingDate.toDate() : null;
									order.paidDate = order.paidDate ? order.paidDate.toDate() : null;

									if (syncData.actionType == ordersTypes.UPDATE) {
										store.dispatch(updateOrder(order));
									} else {
										store.dispatch(addOrder(order));
									}
								}
							});
							break;
						case ordersTypes.REMOVE:
							store.dispatch(removeOrder({
								id: syncData.relatedId,
								isSynced: true
							}));
							break;
						case customersTypes.ADD:
						case customersTypes.UPDATE:
							CustomerServices.get(syncData.relatedId).then(itemDoc => {
								if (itemDoc && itemDoc.exists) {
									let customer = {
										...itemDoc.data(),
										isSynced: true
									}

									if (syncData.actionType == customersTypes.UPDATE) {
										store.dispatch(updateCustomer(customer));
									} else {
										store.dispatch(addCustomer(customer));
									}
								}
							});
							break;
						case customersTypes.REMOVE:
							store.dispatch(removeCustomer({
								id: syncData.relatedId,
								isSynced: true
							}));
							break;
					}
				}
			});

			//Update synced to list
			snapshot.forEach(function(doc){
				if(doc && doc.exists){
					updateSyncedDevice(doc.data());
				}
			});

			isSyncing = false;
		}

		if (isSyncing) {
			//Stop old sync snapshot
			syncingSnapshot();

			//Start new listen
			syncDataAndListen(store);
		}
	});
}

//Update synced devices
export const updateSyncedDevice = (doc)=>{
	SyncServices.getRef().doc(doc.id).update({
		['syncedDevices.' + Constants.deviceId]: true
	});
}