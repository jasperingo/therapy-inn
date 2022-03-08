import { FirebaseError } from "firebase/app";
import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import ERRORS from "../assets/values/errors";
import Chat from "../models/Chat";
import ChatRepository from "../repositories/ChatRepository";
import { useAuthUser } from "./userHook";


type ListReturnType = [
  ()=> void,
  Array<Chat>, 
  boolean, 
  number,
  boolean,
  string | null, 
  ()=> void
];

export const useChatList = (): ListReturnType => {

  const user = useAuthUser() as User;

  const [list, setList] = useState<Array<Chat>>([]);

  const [ended, setEnded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(-1);

  const [error, setError] = useState<string | null>(null);
  
  const onRefresh = useCallback(
    ()=> { 
      setPage(0);
      setList([]);
      setError(null);
      setEnded(false);
      setRefreshing(true);
      setLoading(true); 
    }, 
    []
  );
  
  const fetch = useCallback(
    () => {
      setError(null);
      setPage((old)=> old === -1 ? 0 : old);
      if (!ended) setLoading(true);  
    },
    [ended]
  );
  
  useEffect(
    () => {

      const fetch = async ()=> {
        try {
          
          const result = await ChatRepository.getList(user.uid, page);
          
          setLoading(false);
          setRefreshing(false);
          setList((old)=> old.concat(result));
          if (result.length !== 0)
            setPage(result[result.length-1]?.date);
          setEnded(result.length === 0);
          
        } catch (error) {

          console.log(error)

          setLoading(false);
          setRefreshing(false);
          if (error instanceof FirebaseError)
            setError(error.code);
          else 
            setError(ERRORS.unknown);
        }
      }

      if (loading && !ended) fetch();
    },
    [user, loading, ended, page]
  );

  useEffect(
    ()=> {
      const unsubscribe = ChatRepository.getChanged(user.uid, (chat)=> {
        
        setList(oldList => {

          const oldChat = oldList.find(i=> i.id === chat.id);

          if (oldChat !== undefined && oldChat.date < chat.date) {
            return [chat, ...oldList.filter(i=> i.id !== oldChat.id)];
          }

          return oldList.map(i => (i.id === chat.id) ? chat : i);
        });
      });

      return unsubscribe;
    },
    [user]
  );

  useEffect(
    ()=> {
      const unsubscribe = ChatRepository.getAdded(user.uid, (chat)=> {
        
        setList(oldList => [chat, ...oldList]);

        setPage(oldPage => oldPage === 0 ? chat.date : oldPage);
      });

      return unsubscribe;
    },
    [user]
  );

  return [fetch, list, loading, page, refreshing, error, onRefresh];
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

