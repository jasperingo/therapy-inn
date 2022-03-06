import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import ERRORS from "../assets/values/errors";
import Message from "../models/Message";
import MessageRepository from "../repositories/MessageRepository";

type ListReturnType = [
  ()=> void,
  Array<Message>, 
  boolean, 
  number,
  string | null, 
  (message: Message)=> void,
  (index: number, id: string)=> void
];

export const useMessageList = (messageingListId: string): ListReturnType => {

  const [list, setList] = useState<Array<Message>>([]);

  const [ended, setEnded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(-1);

  const [error, setError] = useState<string | null>(null);
  
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
          
          const result = messageingListId === undefined ? [] : await MessageRepository.getList(messageingListId, page);
          
          setLoading(false);
          setList((old)=> old.concat(result));
          setPage(result[result.length-1]?.date);
          setEnded(result.length === 0);
          
        } catch (error) {

          console.log(error);

          setLoading(false);
          if (error instanceof FirebaseError)
            setError(error.code);
          else 
            setError(ERRORS.unknown);
        }
      }

      if (loading && !ended) fetch();
    },
    [messageingListId, loading, ended, page]
  );

  const onNewMessage = (message: Message) => setList([message, ...list]);

  const onMessageSent = (index: number, id: string) => {
    setList(list.map((item, i)=> {
      if (i === index) item.id = id;
      return item;
    }));
  }
  
  return [fetch, list, loading, page, error, onNewMessage, onMessageSent];
}
