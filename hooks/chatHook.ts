import { useCallback, useState } from "react";
import { FirebaseError } from "firebase/app";
import { Unsubscribe } from "firebase/auth";
import ERRORS from "../assets/values/errors";
import Chat from "../models/Chat";
import ChatRepository from "../repositories/ChatRepository";
import { useNotification } from "./notificationHook";
import { useAppContext } from "./contextHook";


type ListReturnType = [
  (userId: string) => Promise<void>,
  (userId: string) => Unsubscribe,
  (userId: string) => Unsubscribe,
  (error: string) => void,
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
      setLoading(false);
      setError(null);
    }, 
    []
  );
  
  const retryFetch = useCallback(()=> setError(null), []);

  const setPageError = useCallback(
    (error: string)=> {
      setError(error);
      setLoading(false);
      setRefreshing(false);
    },
    []
  );

  const fetchChats = useCallback(
    async (userId: string)=> {

      setLoading(true);
      setError(null);
      setRefreshing(false);
      
      try {
        const response = await ChatRepository.getList(userId);

        setLoaded(true);
        setLoading(false);
        setList(response);
        
      } catch (error) {
        console.log(error);
        setPageError(error instanceof FirebaseError ? error.code : ERRORS.unknown);
      }
    },
    [setPageError]
  );

  const fetchNewChats = useCallback(
    (userId: string) => ChatRepository.getCreate(
      userId,
      (chat) => setList((old)=> { 
        if (old.find(i=> i.id === chat.id) !== undefined) {
          return old;
        } else {
          if (!chat.read && message !== chat.id) 
            sendNotification(chat);
          
          return [chat, ...old];
        }
      }),
      (error) => console.log(error)
    ),
    [message, sendNotification]
  );

  const fetchUpdatedChats = useCallback(
    (userId: string)=> ChatRepository.getUpdate(
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
    ),
    [message, sendNotification, chatReadUpdater]
  );

  return [
    fetchChats, 
    fetchNewChats, 
    fetchUpdatedChats, 
    setPageError, 
    list, 
    loading, 
    loaded, 
    refreshing, 
    error, 
    retryFetch, 
    onRefresh
  ];
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
