
import { FirebaseError } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import ERRORS from '../assets/values/errors';
import AppContextType, { UserActionTypes } from '../context/AppContextType';
import User from '../models/User';
import firebaseApp from '../repositories/firebase.config';
import UserRepository from '../repositories/UserRepository';
import { useAppContext } from './contextHook';

export const useAuthUser = ()=> {
  const auth = getAuth(firebaseApp);
  return auth.currentUser;
}

export const useAppAuthUser = ()=> {
  const { user } = useAppContext();
  return user;
}


type UserFetchReturnTuple = [
  ()=> void,
  boolean, 
  boolean, 
  string | null
];

export const useAuthUserFetch = (): UserFetchReturnTuple => {

  const { userDispatch } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    ()=> {
      setError(null);
      setSuccess(false);
      setLoading((old)=> old === false ? true : false);
    },
    []
  );

  useEffect(
     () => {

      if (!loading) return;

      const auth = getAuth(firebaseApp);

      const unsubscribe = onAuthStateChanged(
        auth, 
        async (user)=> {

          if (user === null) {
            setLoading(false);
            setSuccess(true);
            return;
          }

          try {
            const dbUser = await UserRepository.get(user.uid);
            userDispatch({
              payload: dbUser,
              type: UserActionTypes.FETCHED
            });
            setLoading(false);
            setSuccess(true);
          } catch (error) {
            if (error instanceof FirebaseError)
              setError(error.code);
            else 
              setError(ERRORS.unknown);
          }
        },
        ()=> setError(ERRORS.unknown),
      );

      return unsubscribe;
    },
    [loading, userDispatch]
  );
  
  return [fetch, loading, success, error]
}


type SignUpReturnTuple = [
  (displayName: string, photoURL: string, therapist: boolean, photoBlob: Blob | null)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignUp = (): SignUpReturnTuple => {
  
  const user = useAuthUser();

  const { userDispatch } = useAppContext() as AppContextType;

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (displayName: string, photoURL: string, therapist: boolean, photoBlob: Blob | null) => {

    setLoading(true);

    const appUser: User = {
      displayName,
      photoURL,
      therapist,
      createdAt: Date.now(),
      phoneNumber: user?.phoneNumber as string
    }

    try {
      await UserRepository.create(appUser, photoBlob);
      userDispatch({
        payload: appUser,
        type: UserActionTypes.FETCHED
      });
      setSuccess(true);
    } catch (error) {
      if (error instanceof FirebaseError)
        setError(error.code);
      else 
        setError(ERRORS.unknown);
    } finally {
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


type SignOutReturnTuple = [
  ()=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignOut = (): SignOutReturnTuple => {

  const { userDispatch } = useAppContext() as AppContextType;
  
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false)
    },
    []
  );
  
  const onSubmit = async () => {
    
    setLoading(true);

    try {
      const auth = getAuth(firebaseApp);
      await auth.signOut();
      userDispatch({ type: UserActionTypes.UNFETCHED });
      setSuccess(true);
    } catch {
      setError(ERRORS.signOutFailed);
    } finally{
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


