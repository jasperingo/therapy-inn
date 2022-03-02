import { getAuth, updateProfile, User } from "firebase/auth";
import { set, ref , getDatabase } from "firebase/database";
import { getStorage, ref as StorageRef, uploadBytes  } from "firebase/storage";
import firebaseApp from "./firebase.config";

const UserRepository = {

  async create(displayName: string, photoURL: string, upload: boolean) {

    const auth = getAuth(firebaseApp);

    const storage = getStorage();

    const userPhotoURL = `users/${auth.currentUser?.uid}.${photoURL.split('.').pop()}`;

    if (upload) {

      const resForBlob = await fetch(photoURL);

      const blob = await resForBlob.blob();
    
      const mountainsRef = StorageRef(storage, userPhotoURL);

      await uploadBytes(mountainsRef, blob);
    }


    await updateProfile(auth.currentUser as User, {
      displayName,
      photoURL: userPhotoURL
    });
    
    const db = getDatabase(firebaseApp);

    return set(ref(db, `users/${auth.currentUser?.uid}`), {
      displayName,
      photoURL: userPhotoURL,
      phoneNumber: auth.currentUser?.phoneNumber,
      createdAt: Date.now()
    });
  }

};

export default UserRepository;
