import screens from '../../constants/Screens';
import SettingsScreen from '../../screens/SettingsScreen';
import PinCodeSettingScreen from '../../screens/settings/PinCodeSettingScreen';
import LanguageSettingScreen from '../../screens/settings/LanguageSettingScreen';
import NotificationSettingScreen from '../../screens/settings/NotificationSettingScreen';
import TrackingSettingScreen from '../../screens/settings/TrackingSettingScreen';
import CurrencySettingScreen from '../../screens/settings/CurrencySettingScreen';
import BackupSettingScreen from '../../screens/settings/BackupSettingScreen';
import AccountSettingScreen from '../../screens/settings/AccountSettingScreen';

export default {
    [screens.Settings]: SettingsScreen,
    [screens.PinCodeSetting]: PinCodeSettingScreen,
    [screens.LanguageSetting]: LanguageSettingScreen,
    [screens.NotificationSetting]: NotificationSettingScreen,
    [screens.TrackSettingScreen]: TrackingSettingScreen,
    [screens.CurrencySetting]: CurrencySettingScreen,
    [screens.BackupSetting] : BackupSettingScreen,
    [screens.AccountSettingScreen]: AccountSettingScreen,
}
