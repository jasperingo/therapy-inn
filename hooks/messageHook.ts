import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import ERRORS from "../assets/values/errors";
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";
import { Unsubscribe } from "firebase/auth";
import { useNetworkDetect } from "./utilHook";


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
  (messagingListId: string)=> Unsubscribe | undefined,
  Array<Message>, 
  boolean,
  string | null, 
  (message: Message)=> void,
  (index: number, id: string)=> void,
  ()=> void
];

export const useMessageList = (): ListReturnType => {

  const connected = useNetworkDetect();

  const [list, setList] = useState<Array<Message>>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  
  const retryFetch = useCallback(()=> setError(null), []);

  const fetch = useCallback(
    (messagingListId: string)=> {

      if (!connected) {
        setError(ERRORS.noInternetConnection);
        return;
      }

      setLoading(true);

      setError(null);
      
      return MessageRepository.getAll(
        messagingListId,
        (message)=> {
          setLoading(false);
          setList((old)=> {
            if (old.find(i=> i.id === message.id) !== undefined) {
              return [...old];
            } else if (old[0] === undefined || old[0].date < message.date) {
              return [message, ...old];
            } else {
              return [...old, message];
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
    [connected]
  );

  const onNewMessage = useCallback(
    (message: Message) => setList((oldList)=> [message, ...oldList]), []
  );
  
  const onMessageSent = (index: number, id: string) => setList(
    list.map((item, i)=> {
      if (i === index) {
        item.id = id;
      }
      return item;
    })
  );
  
  
  return [fetch, list, loading, error, onNewMessage, onMessageSent, retryFetch];
}
