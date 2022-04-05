import { useCallback, useState, useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import NetInfo from "@react-native-community/netinfo";
import ERRORS from "../assets/values/errors";
import Chat from "../models/Chat";
import ChatRepository from "../repositories/ChatRepository";
import { useNotification } from "./notificationHook";


type ListReturnType = [
  (userId: string)=> Unsubscribe | undefined,
  (userId: string)=> Unsubscribe | undefined,
  Array<Chat>, 
  boolean,
  boolean,
  boolean,
  string | null, 
  ()=> void,
  ()=> void
];

export const useChatList = (): ListReturnType => {
  
  const sendNotification = useNotification();

  const [list, setList] = useState<Array<Chat>>([]);

  const [connected, setConnected] = useState(false);

  const [loaded, setLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);
  
  const onRefresh = useCallback(
    ()=> { 
      setList([]);
      setLoaded(false);
      setRefreshing(true);
    }, 
    []
  );
  
  const retryFetch = useCallback(
    ()=> { 
      setError(null);
      setLoaded(false);
    }, 
    []
  );

  const fetch = useCallback(
    (userId) => {

      if (!connected) {
        setError(ERRORS.noInternetConnection);
        return;
      }

      setError(null);
      
      setLoading(true);

      return ChatRepository.getAll(
        userId,
        (chat) => {
          setLoading(false);
          setRefreshing(false);
          setLoaded(true);
          setList((old)=> { 
            
            if (!chat.read) sendNotification(chat);

            if (old[0] === undefined || old[0].date < chat.date) {
              return [chat, ...old];
            } else {
              return [...old, chat];
            }
          });
        },
        (error) => {
          console.log(error);

          setLoading(false);
          setRefreshing(false);
          if (error instanceof FirebaseError)
            setError(error.code);
          else 
            setError(ERRORS.unknown);
        }
      );

    },
    [connected, sendNotification]
  );

  useEffect(
    ()=> {
      return NetInfo.addEventListener((state)=> {
        setConnected(state.isConnected ?? false);
      });
    },
    []
  );

  const fetchUpdate = useCallback(
    (userId)=> {

      if (!connected) return;

      return ChatRepository.getUpdate(
        userId, 
        (chat)=> setList(oldList => {

          if (!chat.read) sendNotification(chat);

          const oldChat = oldList.find(i=> i.id === chat.id);

          if (oldChat !== undefined && oldChat.date < chat.date)
            return [chat, ...oldList.filter(i=> i.id !== oldChat.id)];

          return oldList.map(i => (i.id === chat.id) ? chat : i);
        }),
        (error)=> console.log(error)
      );
    },
    [connected, sendNotification]
  );

  return [fetch, fetchUpdate, list, loading, loaded, refreshing, error, retryFetch, onRefresh];
}

export const useChatReadUpdate = () => {

  return async (chat: Chat, userId: string) => {

    try {

      chat.read = true;

      await ChatRepository.update(chat, userId);

    } catch (error) {
      console.error(error);
    }
  }
}

