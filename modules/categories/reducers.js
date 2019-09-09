import { handleActions } from 'redux-actions';
import { update, remove, insertWithUUID, insertAllWithUUID} from '../../utils/stateHelper';
import types from './types';
import { OtherCategory } from '../../constants/Categories';

const createOrUpdateCategory = (props) => {
  const {
    id,
    code,
    name,
    image,
    parentCategory = null,
    isHide = false,
    isSynced = false,
    order = 1,
  } = props;

  return {
    id,
    code,
    name,
    image,
    parentCategory,
    isHide,
    isSynced,
    order,
  };
};

const defaultCategories = [
  // createOrUpdateCategory(OtherCategory)
];

const initialState = insertAllWithUUID({}, defaultCategories);

const categoriesReducer = handleActions({
[types.ADD]: (state, { payload }) => insertWithUUID(state, createOrUpdateCategory(payload)),
[types.UPDATE]: (state, {
  payload
}) => update(state, payload.id, createOrUpdateCategory(payload)),
[types.REMOVE]: (state, { payload }) => remove(state, payload),
[types.RESET]: (state, { payload }) => state = (payload ? payload : initialState),
}, initialState);

export default categoriesReducer;