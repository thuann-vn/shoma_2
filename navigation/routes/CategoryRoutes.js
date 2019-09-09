import screens from '../../constants/Screens';
import CategoryDetailScreen from '../../screens/categories/CategoryDetailScreen';
import CategoryListScreen from '../../screens/categories/CategoryListScreen';
import CategoryMergeScreen from '../../screens/categories/CategoryMergeScreen';

export default {
    [screens.CategoryList]: CategoryListScreen,
    [screens.CategoryDetail]: CategoryDetailScreen,
    [screens.CategoryMerge]: CategoryMergeScreen,
}
