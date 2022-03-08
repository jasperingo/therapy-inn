
import { FirebaseError } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import ERRORS from '../assets/values/errors';
import AppContextType, { UserActionTypes } from '../context/AppContextType';
import firebaseApp from '../repositories/firebase.config';
import UserRepository from '../repositories/UserRepository';
import { useAppContext } from './contextHook';

export const useAuthUser = ()=> {
  const { user } = useAppContext();
  return user;
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

  const { userDispatch, user } = useAppContext();

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
        async (authUser)=> {

          if (authUser === null || user !== null) {
            setLoading(false);
            setSuccess(true);
            return;
          }

          try {
            const dbUser = await UserRepository.get(authUser.uid);
            userDispatch({
              payload: dbUser,
              type: UserActionTypes.FETCHED
            });
            setLoading(false);
            setSuccess(true);
          } catch (error) {
            console.log(error);
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
    [loading, user, userDispatch]
  );
  
  return [fetch, loading, success, error]
}


type SignInReturnTuple = [
  onSubmit: (verificationId: string, verificationCode: string,  phoneNumber: string)=> Promise<void>,
  success: boolean,
  loading: boolean,
  error: string | null,
  resetStatus: ()=> void
];

export const useUserSignIn = (): SignInReturnTuple => {

  const { userDispatch } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  const resetStatus = useCallback(
    ()=> {
      setError(null);
      setSuccess(false);
    },
    []
  );

  const onSubmit = async (verificationId: string, verificationCode: string, phoneNumber: string) => {

    if (loading) return;

    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        setError(ERRORS.noInternetConnection);
      } else {
        setLoading(true);
        const user = await UserRepository.signIn(verificationId, verificationCode, phoneNumber);
        userDispatch({
          payload: user,
          type: UserActionTypes.FETCHED
        });
        setLoading(false);
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error instanceof FirebaseError)
        setError(error.code);
      else 
        setError(ERRORS.unknown);
    }
  }

  return [
    onSubmit, 
    success, 
    loading, 
    error,
    resetStatus
  ];
}


type SignUpReturnTuple = [
  (displayName: string, photoURL: string, therapist: boolean, photoBlob: Blob | null)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserSignUp = (): SignUpReturnTuple => {

  const { user, userDispatch } = useAppContext();

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

    if (user === null || loading) return;

    setLoading(true);

    user.displayName = displayName;
    user.photoURL = photoURL;
    user.therapist = therapist;
    
    try {
      await UserRepository.update(user, photoBlob);
      userDispatch({
        payload: user,
        type: UserActionTypes.FETCHED
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
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


