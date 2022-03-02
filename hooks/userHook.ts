
import { getAuth } from 'firebase/auth';
import firebaseApp from '../repositories/firebase.config';

export const useAuthUser = ()=> {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
}
