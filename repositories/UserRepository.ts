import { FirebaseError } from "firebase/app";
import { getAuth, PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { set, ref , getDatabase, get, child } from "firebase/database";
import { getStorage, ref as StorageRef, uploadBytes  } from "firebase/storage";
import User from '../models/User';
import ERRORS from "../assets/values/errors";
import firebaseApp from "./firebase.config";

const UserRepository = {

  async update({ id, phoneNumber, therapist, displayName, photoURL, createdAt }: User, photoBlob: Blob | null) {

    if (photoBlob !== null) {
      
      const storage = getStorage();

      const mountainsRef = StorageRef(storage, photoURL);

      await uploadBytes(mountainsRef, photoBlob);
    }
    
    const db = getDatabase(firebaseApp);

    return set(ref(db, `users/${id}`), {
      photoURL,
      therapist,
      displayName,
      phoneNumber,
      createdAt,
    });
  },

  async signIn(verificationId: string, verificationCode: string, phoneNumber: string) {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);
    const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
    const { user } = await signInWithCredential(auth, credential);
    const snapshot = await get(child(ref(db), `users/${user.uid}`));

    if (snapshot.exists()) {
      const oldUser = snapshot.val() as User;
      oldUser.id = snapshot.key as string;
      return oldUser;
    } else {
      set(ref(db, `users/${user.uid}`), { phoneNumber, createdAt: Date.now() });
      return { 
        phoneNumber, 
        createdAt: Date.now(), 
        photoURL: '', 
        displayName: '', 
        therapist: false, 
        id: user.uid 
      } as User;
    }
  },

  async get(id: string) {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, `users/${id}`));
    if (snapshot.exists()) {
      const user = snapshot.val() as User;
      user.id = snapshot.key as string;
      return user;
    } else {
      throw new FirebaseError(ERRORS.userNotFound, '');
    }
  }

};

export default UserRepository;
