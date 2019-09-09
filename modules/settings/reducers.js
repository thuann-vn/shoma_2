import { handleActions } from "redux-actions";
import types from "./types";
import { DefaultDateFormat } from "../../constants/Common";
import { getTimezoneOffset } from "../../utils/dateHelper";
import * as Localization from 'expo-localization';
import { DEFAULT_PACKS } from "../../constants/Icons";

const initialState = {
  icons: null,
  activeAccount: null,
  currency: Localization.locale =='vi-VN' ? 'VND' : "USD",
  language: Localization.locale == 'vi-VN' ? 'vi' :'en',
  isSignedIn: false,
  user: null,
  isFirstLaunch: true,
  dateFormat: DefaultDateFormat,
  pinCodeEnabled: false,
  fingerPrintEnabled: false,
  pinCodes: [],
  backupEnabled: true,
  lastBackupTime: null,
  notificationToken: null,
  deviceToken: null, 
  notificationEnabled: false,
  timezoneOffset: getTimezoneOffset(),
  mustShowPinCode: false,
  iconPacks: DEFAULT_PACKS,
  trackingEnabled: true,
  isSaveNotificationToken: false,
  firsTimeShowIntro: true,
  lastTimeAskReview: null,
  orderIncrement: 10000,
  orderIncrementPrefix: 'DH',
  orderDraftIncrement: 0,
  orderDraftIncrementPrefix: 'T',
};

const settingsReducer = handleActions(
  {
    [types.SET_ACTIVE_ACCOUNT]: (state, { payload }) => ({
      ...state,
      activeAccount: payload
    }),
    [types.SET_FIRST_LAUNCH_FINISH]: (state, {
      payload
    }) => ({
      ...state,
      isFirstLaunch: !payload
    }),
    [types.CHANGE_LANGUAGE]: (state, { payload }) => ({
      ...state,
      language: payload
    }),
    [types.CHANGE_CURRENCY]: (state, { payload }) => ({
      ...state,
      currency: payload
    }),
    [types.BACKUP_TOGGLE]: (state, { payload }) => ({
      ...state,
      backupEnabled: payload
    }),
    [types.CHANGE_DATE_FORMAT]: (state, { payload }) => ({
      ...state,
      dateFormat: payload
    }),
    [types.SET_PIN_CODE]: (state, { payload }) => ({
      ...state,
      pinCodeEnabled: true,
      pinCodes: payload
    }),
    [types.REMOVE_PIN_CODE]: (state) => ({
      ...state,
      pinCodeEnabled: false,
      pinCodes: []
    }),
    [types.ENABLE_FINGER_PRINT]: (state) => ({
      ...state,
      fingerPrintEnabled: true,
    }),
    [types.DISABLE_FINGER_PRINT]: (state) => ({
      ...state,
      fingerPrintEnabled: false
    }),
    [types.SIGN_IN]: (state, { payload }) => ({
      ...state,
      isSignedIn: true,
      user: payload
    }),
    [types.SIGN_OUT]: (state, { payload }) => ({
      ...state,
      isSignedIn: false,
      user: null
    }),
    [types.RESET]: state => (state = initialState),
    [types.SET_LAST_BACKUP_TIME]: (state, { payload }) => ({
      ...state,
      lastBackupTime: payload,
    }),
    [types.SET_LAST_SHOW_ADS_TIME]: (state, {
      payload
    }) => ({
      ...state,
      lastShowAdsTime: payload,
    }),
    [types.ENABLE_NOTIFICATION]: (state, { payload }) => ({
      ...state,
      notificationEnabled: true,
      notificationToken: payload
    }),
    [types.DISABLE_NOTIFICATION]: (state) => ({
      ...state,
      notificationEnabled: false,
    }),
    [types.SET_MUST_SHOW_PIN_CODE]: (state, {payload}) => ({
      ...state,
      mustShowPinCode: payload,
    }),
    [types.SET_TRACKING_ENABLED]: (state, {payload}) => ({
      ...state,
      trackingEnabled: payload,
    }),
    [types.SET_ICONS]: (state, {payload}) => ({
      ...state,
      icons: payload,
    }),
    [types.SET_ICON_PACKS]: (state, {payload}) => ({
      ...state,
      iconPacks: payload,
    }),
    [types.SET_RESTORE_DATA_STATE]: (state, {
      payload
    }) => ({
      ...state,
      isRestoringData: payload,
    }),
    [types.SET_SAVED_NOTIFICATION_TOKEN_STATE]: (state, {
      payload
    }) => ({
      ...state,
      isSaveNotificationToken: payload,
    }),
    [types.SET_FIRST_TIME_INTRO_STATE]: (state, {
      payload
    }) => ({
      ...state,
      firsTimeShowIntro: payload,
    }),
    [types.SET_REVIEW_TIME]: (state, {payload}) => ({
      ...state,
      lastTimeAskReview: payload,
    }),
    [types.UPDATE_ORDER_INCREMENT]: (state) => ({
      ...state,
      orderIncrement: state.orderIncrement + 1,
    }),
    [types.UPDATE_DRAFT_ORDER_INCREMENT]: (state) => ({
      ...state,
      orderDraftIncrement: state.orderDraftIncrement + 1,
    }),
  },
  initialState
);

export default settingsReducer;
