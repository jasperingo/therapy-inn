
import { FirebaseError } from 'firebase/app';
import { getAuth, onAuthStateChanged, Unsubscribe } from 'firebase/auth';
import { useCallback, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import ERRORS from '../assets/values/errors';
import AppContextType, { UserActionTypes } from '../context/AppContextType';
import firebaseApp from '../repositories/firebase.config';
import UserRepository from '../repositories/UserRepository';
import { useAppContext } from './contextHook';
import User from '../models/User';

export const useAuthUser = ()=> {
  const { user } = useAppContext();
  return user;
}


type UserFetchReturnTuple = [
  ()=> Unsubscribe,
  (error: string) => void,
  boolean, 
  boolean, 
  string | null,
  () => void
];

export const useAuthUserFetch = (): UserFetchReturnTuple => {

  const { userDispatch } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const retryFetch = ()=> setError(null);

  const setPageError = (error: string)=> {
    setError(error);
    setLoading(false);
  }

  const fetchUser = useCallback(
    () => {

      setError(null);
      setLoading(true);

      return onAuthStateChanged(
        getAuth(firebaseApp), 
        async (authUser)=> {

          if (authUser === null) {
            setSuccess(true);
            setLoading(false);
            return;
          }

          try {
            const dbUser = await UserRepository.get(authUser.uid);
            userDispatch({
              payload: dbUser,
              type: UserActionTypes.FETCHED
            });
            setSuccess(true);
            setLoading(false);
          } catch (error) {
            console.error(error);
            setLoading(false);
            setError((error instanceof FirebaseError) ? error.code : ERRORS.unknown);
          }
        },
        ()=> { 
          setLoading(false);
          setError(ERRORS.unknown);
        },
      );
    },
    [userDispatch]
  );
  
  return [fetchUser, setPageError, loading, success, error, retryFetch]
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


type UpdateReturnTuple = [
  (displayName: string, photoURL: string, therapist: boolean, photoBlob: Blob | null)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useUserUpdate = (): UpdateReturnTuple => {

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


type TherapistReturnTuple = [
  load: ()=> void,
  therapist: User | null,
  messagingListId: string | undefined,
  loading: boolean, 
  success: boolean, 
  error: string | null,
  retry: ()=> void
];

export const useTherapistFetch = (): TherapistReturnTuple => {

  const user = useAuthUser();

  const [therapist, setTherapist] = useState<User | null>(null);

  const [messagingListId, setMessagingListId] = useState<string | undefined>();

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async ()=> {
      try {

        const [theTherapist, messagingId] = await UserRepository.getTherapist(user?.id as string);

        setMessagingListId(messagingId);
        setTherapist(theTherapist);
        setSuccess(true);

      } catch (error) {
        console.log(error);
        if (error instanceof FirebaseError)
          setError(error.code);
        else 
          setError(ERRORS.unknown);
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  const load = useCallback(
    async () => {
      
      if (loading || error !== null || success) return;

      try {
        const state = await NetInfo.fetch();

        if (!state.isConnected) {
          setError(ERRORS.noInternetConnection);
        } else {
          setLoading(true);
          fetch();
        }
      } catch (error) {
        setError(ERRORS.unknown);
      }
    },
    [loading, error, success, fetch]
  );

  const retry = ()=> setError(null);
  
  return [load, therapist, messagingListId, loading, success, error, retry];
}

