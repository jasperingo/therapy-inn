import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import ERRORS from "../assets/values/errors";
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";
import { Unsubscribe } from "firebase/auth";


export const useMessageCreate = (hasId: boolean) => {

  const [done, setDone] = useState(hasId);
  const [loading, setLoading] = useState(false);

  return useCallback(
    async (message: Message, messagingListId?: string) => {
    
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
    },
    [done, loading]
  );
}


type ListReturnType = [
  (messagingListId: string) => Promise<void>,
  (messagingListId: string, userId: string)=> Unsubscribe | undefined,
  (error: string) => void,
  Array<Message>, 
  boolean,
  boolean,
  string | null, 
  (message: Message)=> void,
  (index: number, id: string)=> void,
  ()=> void
];

export const useMessageList = (): ListReturnType => {

  const [list, setList] = useState<Array<Message>>([]);

  const [loaded, setLoaded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  
  const retryFetch = useCallback(()=> setError(null), []);

  const setPageError = useCallback(
    (error: string)=> {
      setError(error);
      setLoading(false);
    },
    []
  );

  const fetchMessages = useCallback(
    async (messagingListId: string)=> {

      setLoading(true);
      setError(null);
      
      try {
        const response = await MessageRepository.getList(messagingListId);
        
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

  const fetchNewMessages = useCallback(
    (messagingListId: string, userId: string)=> MessageRepository.getCreate(
      messagingListId,
      (message)=> setList((old)=> (message.senderId === userId || old.find(i=> i.id === message.id) !== undefined) ? old : [message, ...old]),
      (error) => console.log(error)
    ),
    []
  );

  const onNewMessage = (message: Message) => setList((oldList)=> [message, ...oldList]);
  
  const onMessageSent = (index: number, id: string) => setList((old)=> old.map((item, i)=> (i === index) ? ({ ...item, id }) : item));
  
  return [
    fetchMessages, 
    fetchNewMessages, 
    setPageError, 
    list, 
    loading, 
    loaded, 
    error, 
    onNewMessage, 
    onMessageSent, 
    retryFetch
  ];
}
