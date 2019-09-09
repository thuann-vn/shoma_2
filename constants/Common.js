import moment from 'moment';
import Images from './Images';
import { DEFAULT_ICON } from './Icons';
import { SavingPeriod, SavingEndAction, SavingInterestPaid } from './AccountTypes';
import { OrderStatus, OrderPaymentStatus, OrderDiscountTypes } from './Orders';
import Colors from './Colors';
import { TransitionPresets } from 'react-navigation-stack';

export const CONFIG = {
    enableUnsplash: false,
    showAds: false,
    devMode: false,
    isProVersion: false,
    showClearDataSetting: false,
    showAdsInterval: 60000 * 30, //30 minutes
    homePage: 'https://thuann-vn.github.io/ex-ma',
    privacyPage: 'https://thuann-vn.github.io/ex-ma/privacy_policy.html'
}

export const TEST_USERS = ['0vfT0W1UtjW4aDAykGfeghwTR0Y2', 'j6rbL8IY60OaTCGlkLLUXYt00X03'];

export const DEFAULT_NAVIGATION_OPTIONS = {
    defaultNavigationOptions: {
        ...TransitionPresets.SlideFromRightIOS,
        headerMode: 'float',
        headerBackTitleVisible: false,
        // cardOverlayEnabled: true,
        gestureEnabled: true,
        backTitle: null,
        headerBackTitle: null,
        headerTitle: '',
        headerStyle: {
            backgroundColor: Colors.mainColor,
            borderBottomColor: "transparent",
            shadowColor: 'none',
        },
        headerTintColor: "#fff"
    }
}


export const DefaultDateFormat = 'YYYY/MM/DD';
export const DateRangeTypes = {
    'yearly': 1,
    'quarterly': 2,
    'monthly': 3,
    'weekly': 4,
    'daily': 5
}
export const defaultCategoryData = {
    name: '',
    icon: DEFAULT_ICON,
    isIncome: false,
}

export const defaultProductData = {
    name: '',
    cost: 0,
    price: 0,
    description: ''
}

export const defaultOrderData = {
    status: OrderStatus.confirmed,
    paymentStatus: OrderPaymentStatus.pending,
    discountTotal: 0,
    discountValue: 0,
    discountType: OrderDiscountTypes.none,
    shippingFee: 0,
    total: 0,
    subTotal: 0,
    items: {
    }
}

export const defaultDateRanges = [
    {
        title: 'common_next_year',
        value: [moment().subtract(-1, 'year').startOf('year'), moment().subtract(-1, 'year').endOf('year')],
        type: DateRangeTypes.yearly
    },
    {
        title: 'common_next_quarter',
        value: [moment().subtract(-1, 'quarter').startOf('quarter'), moment().subtract(-1, 'quarter').endOf('quarter')],
        type: DateRangeTypes.quarterly
    },
    {
        title: 'common_next_month',
        value: [moment().subtract(-1, 'month').startOf('month'), moment().subtract(-1, 'month').endOf('month')],
        type: DateRangeTypes.monthly
    },
    {
        title: 'common_next_week',
        value: [moment().subtract(-1, 'week').startOf('week'), moment().subtract(-1, 'week').endOf('week')],
        type: DateRangeTypes.weekly
    },
    {
        title: 'common_this_year',
        value: [moment().startOf('year'), moment().endOf('year')],
        type: DateRangeTypes.yearly
    },
    {
        title: 'common_this_quarter',
        value: [moment().startOf('quarter'), moment().endOf('quarter')],
        type: DateRangeTypes.quarterly
    },
    {
        title: 'common_this_month',
        value: [moment().startOf('month'), moment().endOf('month')],
        type: DateRangeTypes.monthly
    },
    {
        title: 'common_this_week',
        value: [moment().startOf('week'), moment().endOf('week')],
        type: DateRangeTypes.weekly
    },
]


export const reportDateRanges = [
    {
        title: 'common_this_week',
        value: [moment().startOf('week'), moment().endOf('week')],
        type: DateRangeTypes.daily
    },
    {
        title: 'common_last_week',
        value: [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
        type: DateRangeTypes.daily
    },
    {
        title: 'common_this_month',
        value: [moment().startOf('month'), moment().endOf('month')],
        type: DateRangeTypes.daily
    },
    {
        title: 'common_last_month',
        value: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        type: DateRangeTypes.daily
    },
    {
        title: 'common_last_3_month',
        value: [moment().subtract(3, 'month').startOf('month'), moment().endOf('month')],
        type: DateRangeTypes.weekly
    },
    {
        title: 'common_last_6_month',
        value: [moment().subtract(6, 'month').startOf('month'), moment().endOf('month')],
        type: DateRangeTypes.monthly
    },
    {
        title: 'common_this_year',
        value: [moment().startOf('year'), moment().endOf('year')],
        type: DateRangeTypes.monthly
    },
    {
        title: 'common_last_year',
        value: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        type: DateRangeTypes.monthly
    },
]


export const defaultTransactionData = {
    category: null,
    isDebtLoan: false,
    note: "",
    value: 0,
    account: null,
    currency: "USD",
    date: new Date(),
    contacts: [],
    reminder: null,
    isSynced: false,
    moreInfoCollapsed: false
};

export const Languages = [
    {
        code: 'en',
        name: 'English',
        image: Images.language_english
    },
    {
        code: 'vi',
        name: 'Tiếng Việt',
        image: Images.language_vietnamese
    }
]

export const DateFormats = [
    {
        code: 'DD/MM/YYYY',
    },
    {
        code: 'MM/DD/YYYY',
    },
    {
        code: 'YYYY/MM/DD',
    }
]

export const LogEvents = {
    OpenApp: 'OpenApp',
    Register: 'Register',
    LoginWithFacebook: 'LoginWithFacebook',
    ForgetPassword: 'ForgetPassword',
    ForgetPasswordFailed: 'ForgetPasswordFailed',
    Login: 'Login',
    LoginFailed: 'LoginFailed',
    Logout: 'Logout',
    CreateAccount: 'CreateAccount',
    CreateAccountFailed: 'CreateAccountFailed',
    CreatePlan: 'CreatePlan',
    CreateTransaction: 'CreateTransaction',
    CreateContact: 'CreateContact',
    CreateCategory: 'CreateCategory',
    CreateOrder: 'CreateOrder',
    BuyIconFailed: 'BuyIconFailed',
    BuyIcon: 'BuyIcon'
}