import {
  HorizonButton,
  IOSButton,
  LinkButton,
  RoundedButton,
  StackedButton,
  WithIconButton
} from "./buttons/StyledButton";
import { HeaderButton } from "./buttons/HeaderButton";
import { CustomButtonGroup } from './buttonGroup';
import {
  AvenirFormattedMessage,
  AvenirText} from "./text/StyledText";
import { DefaultPanel } from "./panels";
import CalculatorInput from "./calculator";
import CategoryPicker from "./categoryPicker";
import Value from "./value";
import DateText from "./dateFormat";
import SearchBar from "./searchBar";
import { CalButton } from "./calculator/calButton";
import ImagePicker from "./imagePicker";
import ViewWithTitle from "./viewWithTitle";
import { CustomSwitch } from "./switch";
import { Separator } from "./separator";
import { EmptyState } from "./emptyState";
import UserProfile from "./auth/userProfile";
import CustomTextInput from "./textInput";
import CustomMaterialTextInput from "./textInput/material";
import CustomNumberInput from "./textInput/number";
import NumberFormatTextInput from "./textInput/numberFormat";
import ToastMessage from "./toasts";
import Image from './image';
import CustomerInfo from './customers/info';
import { Badge } from 'react-native-elements';
import MenuItem from './menu/menuItem';
import OrderRow from './orders/row';
import CardComponent from './card';
import ProductRow from './products/row';
import * as Icon from '@expo/vector-icons';
import Picker from './picker';

export {
  //Auth
  UserProfile,
  //View and Panel
  ViewWithTitle,
  SearchBar,
  DefaultPanel,
  //Texts
  AvenirText,
  AvenirFormattedMessage,
  //Inputs
  CalculatorInput,
  CustomTextInput,
  CustomMaterialTextInput,
  CustomNumberInput,
  NumberFormatTextInput,
  //Buttons
  HeaderButton,
  LinkButton,
  IOSButton,
  RoundedButton,
  WithIconButton,
  CalButton,
  StackedButton,
  HorizonButton,
  CustomButtonGroup,

  //Rows
  OrderRow,
  ProductRow,

  //Customer
  CustomerInfo,
  
  //Pickers
  ImagePicker,
  CategoryPicker,
  //Others
  Icon,
  EmptyState,
  Separator,
  CustomSwitch,
  Value,
  DateText,
  ToastMessage,
  Image,
  Badge,
  MenuItem,
  CardComponent,
  Picker
};
