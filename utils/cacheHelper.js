import {
    CacheManager
} from "react-native-expo-image-cache";

export const getCacheImage = async (uri)=>{
    return await CacheManager.get(uri).getPath() || uri;
}