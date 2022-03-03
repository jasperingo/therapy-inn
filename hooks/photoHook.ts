
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export const usePickPhoto = () => {

  return async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      return false;
    }

    return ImagePicker.launchImageLibraryAsync();
  }
}

export const usePhotoURIToBlob = () => {
  
  return async (url: string) => {
    const resForBlob = await fetch(url);
    return resForBlob.blob();
  }
}

export const usePhotoDownloadURL = () => {

  return async (photoURL: string) => {
    const storage = getStorage();
    return getDownloadURL(ref(storage, photoURL));
  }
}

export const usePhotoURLMaker = (type: 'users' | 'articles') => {
  return (uid: string, mimeType: string)=> `${type}/${uid}.${mimeType.split('/')[1]}`;
}

