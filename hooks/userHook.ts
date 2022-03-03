
import { FirebaseError } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useState } from 'react';
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
  const { user } = useAppContext() as AppContextType;
  return user;
}

export const useAuthUserFetch = () => {

  const { userDispatch } = useAppContext() as AppContextType;

  return () => {
    return new Promise<boolean>((resolve, reject) => {
      const auth = getAuth(firebaseApp);
      onAuthStateChanged(
        auth, 
        async (user)=> {
          if (user === null) {
            reject('No signed in user');
            return;
          }
          try {
            const dbUser = await UserRepository.get(user.uid);
            userDispatch({
              payload: dbUser,
              type: UserActionTypes.FETCHED
            });
            resolve(true);
          } catch (error) {
            reject(error);
          }
        },
        ()=> reject('Fetching auth user failed')
      );
    });
  }
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
      userDispatch({ type: UserActionTypes.SIGNED_OUT });
      setSuccess(true);
    } catch {
      setError(ERRORS.signOutFailed);
    } finally{
      setLoading(false);
    }
  }

  return [onSubmit, success, loading, error, resetStatus];
}


