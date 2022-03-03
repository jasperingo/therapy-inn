import { FirebaseError } from "firebase/app";
import { getAuth, updateProfile, User } from "firebase/auth";
import { set, ref , getDatabase, get, child } from "firebase/database";
import { getStorage, ref as StorageRef, uploadBytes  } from "firebase/storage";
import AppUser from '../models/User';
import ERRORS from "../assets/values/errors";
import firebaseApp from "./firebase.config";

const UserRepository = {

  async create({ phoneNumber, therapist, displayName, photoURL, createdAt }: AppUser, photoBlob: Blob | null) {

    const auth = getAuth(firebaseApp);

    if (photoBlob !== null) {
      
      const storage = getStorage();

      const mountainsRef = StorageRef(storage, photoURL);

      await uploadBytes(mountainsRef, photoBlob);
    }

    await updateProfile(auth.currentUser as User, {
      photoURL,
      displayName
    });
    
    const db = getDatabase(firebaseApp);

    return set(ref(db, `users/${auth.currentUser?.uid}`), {
      photoURL,
      therapist,
      displayName,
      phoneNumber,
      createdAt,
    });
  },

  async get(id: string) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `users/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as AppUser;
    } else {
      throw new FirebaseError(ERRORS.userNotFound, '');
    }
  }

};

export default UserRepository;
