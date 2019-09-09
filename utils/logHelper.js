import * as Amplitude from 'expo-analytics-amplitude';
import {
    CONFIG, TEST_USERS
} from '../constants/Common';
export const logToAmplitude = (type, params = null, isEnabled = true, userId = null) => {
    if (CONFIG.devMode || !isEnabled) {
        return;
    }

    //Check if user is test
    if (userId && TEST_USERS.indexOf(userId) >= 0) {
        console.log("Test User, stopped logging data");
        return;
    }

    //Log to amplitude
    if(params){
        Amplitude.logEventWithProperties(type, params);
    }else{
        Amplitude.logEvent(type, params);
    }
}