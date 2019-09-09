import { DeviceServices } from "../services/devices";
import { Constants } from "expo-barcode-scanner";

/**
 * 
 * @param {function} callback 
 */
export const getListDevices = (callback)=>{
    DeviceServices.list().then(snapshot => {
        var devices = {};
        snapshot.forEach(doc => {
            const device = doc.data();
            devices[device.id] = device;
        });
        callback(devices);
    })
}