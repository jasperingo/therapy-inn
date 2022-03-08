import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import ERRORS from "../assets/values/errors";
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";


export const useMessageCreate = (hasId: boolean) => {

  const [done, setDone] = useState(hasId);
  const [loading, setLoading] = useState(false);

  return async (message: Message, messagingListId?: string) => {
    
    if (loading || done) return;
    
    setLoading(true);

    try {
      const messageId = await MessageRepository.create(message, messagingListId);

      setDone(true);

      return messageId;

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
}


type ListReturnType = [
  ()=> void,
  Array<Message>, 
  boolean,
  string | null, 
  (message: Message)=> void,
  (index: number, id: string)=> void
];

export const useMessageList = (messagingListId: string, userId: string): ListReturnType => {

  const [list, setList] = useState<Array<Message>>([]);

  const [ended, setEnded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);

  const [error, setError] = useState<string | null>(null);
  
  const fetch = useCallback(
    async ()=> {
      try {

        const result = 
          messagingListId === undefined ? 
          [] : await MessageRepository.getList(messagingListId, page);
        
        setEnded(result.length === 0);
        setPage(result[result.length-1]?.date);
        setList((old)=> old.concat(result));
        
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
    [messagingListId, page]
  );

  const load = useCallback(
    async () => {
      setError(null);
      if (loading || ended) return;

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
    [loading, ended, fetch]
  );

  const onNewMessage = useCallback(
    (message: Message) => setList((oldList)=> [message, ...oldList]), []
  );
  
  const onMessageSent = (index: number, id: string) => {
    setList(list.map((item, i)=> {
      if (i === index) {
        item.id = id;
      }
      return item;
    }));
  }

  useEffect(
    ()=> {
      const unsubscribe = MessageRepository.getNew(messagingListId, (message)=> {
        if (message.senderId !== userId) {
          onNewMessage(message);
        }
      });

      return unsubscribe;
    },
    [userId, messagingListId, onNewMessage]
  );
  
  return [load, list, loading, error, onNewMessage, onMessageSent];
}
