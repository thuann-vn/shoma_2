
import LoginScreen from '../../screens/auth/LoginScreen';
import SignupScreen from '../../screens/auth/SignupScreen';
import ForgotPasswordScreen from '../../screens/auth/ForgotPasswordScreen';
import Screens from '../../constants/Screens';
import WelcomeScreen from '../../screens/WelcomeScreen';
import WizardLanguageScreen from '../../screens/wizard/WizardLanguageScreen';

export default {
    [Screens.WizardLanguage]: WizardLanguageScreen,
    [Screens.Welcome]: WelcomeScreen,
    [Screens.Login]: LoginScreen,
    [Screens.Register]: SignupScreen,
    [Screens.ForgotPassword]: ForgotPasswordScreen,
}
