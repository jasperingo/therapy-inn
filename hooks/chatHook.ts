import { useCallback, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import ERRORS from "../assets/values/errors";
import Chat from "../models/Chat";
import ChatRepository from "../repositories/ChatRepository";
import { useNotification } from "./notificationHook";
import { useAppContext } from "./contextHook";
import { useNetworkDetect } from "./utilHook";


type ListReturnType = [
  (userId: string)=> Unsubscribe | undefined,
  (userId: string)=> Unsubscribe | undefined,
  (userId: string) => Promise<void>,
  Array<Chat>, 
  boolean,
  boolean,
  boolean,
  string | null, 
  ()=> void,
  ()=> void
];

export const useChatList = (): ListReturnType => {

  const { message } = useAppContext();
  
  const chatReadUpdater = useChatReadUpdate();

  const sendNotification = useNotification();

  const connected = useNetworkDetect();

  const [list, setList] = useState<Array<Chat>>([]);

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
  
  const retryFetch = useCallback(()=> setError(null), []);

  const checkExists = useCallback(
    async (userId: string)=> {

      if (!connected) {
        setError(ERRORS.noInternetConnection);
        return;
      }

      try {
        if (!await ChatRepository.exists(userId)) {
          setLoaded(true);
          setLoading(false);
        }
      } catch(error) {
        console.log(error);
        setError(ERRORS.unknown);
      }
    },
    [connected]
  );

  const fetch = useCallback(
    (userId: string) => {

      setRefreshing(false);

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
          setLoaded(true);
          setList((old)=> { 
            
            if (!chat.read && message !== chat.id) sendNotification(chat);

            const filteredList = old.filter(i=> i.id !== chat.id);

            if (old[0] === undefined || old[0].date < chat.date) {
              return [chat, ...filteredList];
            } else {
              return [...filteredList, chat];
            }
          });
        },
        (error) => {
          console.log(error);

          setLoading(false);
          if (error instanceof FirebaseError)
            setError(error.code);
          else 
            setError(ERRORS.unknown);
        }
      );

    },
    [message, connected, sendNotification]
  );

  const fetchUpdate = useCallback(
    (userId)=> {

      return ChatRepository.getUpdate(
        userId, 
        (chat)=> setList(oldList => {

          if (!chat.read && message !== chat.id) sendNotification(chat);
          else if (message === chat.id) chatReadUpdater(chat, userId);

          const oldChat = oldList.find(i=> i.id === chat.id);

          if (oldChat !== undefined && oldChat.date < chat.date)
            return [chat, ...oldList.filter(i=> i.id !== oldChat.id)];

          return oldList.map(i => (i.id === chat.id) ? chat : i);
        }),
        (error)=> console.log(error)
      );
    },
    [message, sendNotification, chatReadUpdater]
  );

  return [fetch, fetchUpdate, checkExists, list, loading, loaded, refreshing, error, retryFetch, onRefresh];
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
