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
  
  return [fetch, list, loading, page, refreshing, error, onRefresh];
}

