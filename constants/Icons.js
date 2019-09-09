import Colors from './Colors';
import {
    iOSColors
} from 'react-native-typography';
import { FlatIcons } from './icons/flat';
import { USABanks } from './icons/usa_banks';
import { CanadaBanks } from './icons/canada_banks';
import { VietnamBanks } from './icons/vietnam_banks';
import { ThaiBanks } from './icons/thai_banks';
import { SingaporeBanks } from './icons/singapore_banks';
import { MalayBanks } from './icons/malay_banks';
import { IndoBanks } from './icons/indo_banks';
import { SummerIcons } from './icons/summer';
import { HouseIconPack } from './icons/house';
import { LoverIconPack } from './icons/lover';
import { InternationalBanks } from './icons/international_banks';

export const DEFAULT_PACKS = ['icon_flat_pack'];
export const DEFAULT_ICON = 'flat_box';

export const colors = {
    ...iOSColors,
    green_light: '#96ffa4',
    red_light: '#ffd3d8',
    red: '#E04F5E',
    blue: '#035FD2',
    yellow: '#EFC84A',
    blue_chalk: '#F1E7FE',
    wist_ful: '#AEA8D3',
}

export const IconPacks = {
    flat: {
        name: 'icon_flat_pack',
        icon: 'flat_average_2',
        price: 0,
        icons: FlatIcons
    },
    vietnam_banks: {
        name: 'icon_vietnam_banks_pack',
        icon: 'vietnam_banks_vcb',
        price: 0,
        icons: VietnamBanks
    },
    international_banks: {
        name: 'icon_international_banks_pack',
        icon: 'international_banks_mastercard',
        price: 0,
        icons: InternationalBanks
    },
    american_banks: {
        name: 'icon_american_banks_pack',
        icon: 'usa_bank_anz',
        price: 0,
        icons: USABanks
    },
    canada_banks: {
        name: 'icon_canada_banks_pack',
        icon: 'canada_bank_7',
        price: 0,
        icons: CanadaBanks
    },
    thai_banks: {
        name: 'icon_thai_banks_pack',
        icon: 'thai_bank_01',
        price: 0,
        icons: ThaiBanks
    },
    singapore_banks: {
        name: 'icon_singapore_banks_pack',
        icon: 'sing_bank_2',
        price: 0,
        icons: SingaporeBanks
    },
    malay_banks: {
        name: 'icon_malay_banks_pack',
        icon: 'malay_bank_1',
        price: 0,
        icons: MalayBanks
    },
    indo_banks: {
        name: 'icon_indo_banks_pack',
        icon: 'indo_bank_1',
        price: 0,
        icons: IndoBanks
    },
    house: {
        name: 'icon_house_pack',
        icon: 'house_icon_01',
        price: 0,
        icons: HouseIconPack
    },
    lover: {
        name: 'icon_lover_pack',
        icon: 'lover_icon_02',
        price: 0,
        icons: LoverIconPack
    },
    summer: {
        name: 'icon_summer_pack',
        icon: 'summer_pack_01',
        price: 0,
        icons: SummerIcons
    }
}


export default {
    ...FlatIcons,
    ...VietnamBanks,
    ...USABanks,
    ...CanadaBanks,
    ...ThaiBanks,
    ...IndoBanks,
    ...SingaporeBanks,
    ...MalayBanks,
    ...SummerIcons,
    ...LoverIconPack,
    ...HouseIconPack,
    ...InternationalBanks
};