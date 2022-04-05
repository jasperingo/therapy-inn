import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import ERRORS from "../assets/values/errors";
import { ArticleActionTypes } from "../context/AppContextType";
import Article from "../models/Article";
import ArticleRepository from "../repositories/ArticleRepository";
import { useAppContext } from "./contextHook";
import { usePhotoURLMaker } from "./photoHook";
import { useAuthUser } from "./userHook";
import { useNetworkDetect } from "./utilHook";

type CreateReturnTuple = [
  (title: string, link: string, photoBlob: Blob)=> Promise<void>,
  boolean,
  boolean,
  string | null,
  ()=> void
];

export const useArticleCreate = (): CreateReturnTuple => {

  const user = useAuthUser();

  const { articleDispatch } = useAppContext();

  const photoURLMaker = usePhotoURLMaker('articles');

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

  const onSubmit = async (title: string, link: string, photoBlob: Blob) => {
    
    if (loading) return;

    setLoading(true);

    const article: Article = {
      link,
      title,
      id: '',
      photoURL: '',
      creatdAt: Date.now(),
      userId: user?.id as string
    }

    try {
      article.id = await ArticleRepository.create(article);

      article.photoURL = photoURLMaker(article.id, photoBlob.type);

      await ArticleRepository.updatePhoto(article, photoBlob);

      setSuccess(true);

      articleDispatch({
        payload: { article },
        type: ArticleActionTypes.CREATED
      });

    } catch (error) {
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


type DeleteReturnTuple = [
  (article: Article)=> Promise<void>,
  boolean,
  string | null,
];

export const useArticleDelete = (): DeleteReturnTuple => {

  const { articleDispatch } = useAppContext();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (article: Article) => {
    
    setLoading(true);

    try {
      await ArticleRepository.delete(article);

      articleDispatch({
        payload: { article },
        type: ArticleActionTypes.DELETED
      });

    } catch (error) {
      setLoading(false);
      if (error instanceof FirebaseError)
        setError(error.code);
      else 
        setError(ERRORS.unknown);
    }
  }

  return [onSubmit, loading, error];
}


type FetchReturnType = [
  ()=> Promise<void>,
  Array<Article>, 
  boolean, 
  boolean,
  boolean,
  string | null, 
  ()=> void,
  ()=> void
];

export const useArticleFetch = (): FetchReturnType => {

  const { 
    articles: { 
      list,
      loading,
      refreshing,
      loaded,
      error
    },
    articleDispatch
  } = useAppContext();

  const connected = useNetworkDetect();
  
  const onRefresh = useCallback(
    ()=> { 
      articleDispatch({ type: ArticleActionTypes.UNFETCHED });
    }, 
    [articleDispatch]
  );

  const retryFetch = useCallback(
    ()=> {
      articleDispatch({ type: ArticleActionTypes.FETCHED, payload: { error: null } });
    }, 
    [articleDispatch]
  );
  
  const fetch = useCallback(
    async ()=> {

      if (!connected) {
        articleDispatch({ 
          type: ArticleActionTypes.FETCHED,
          payload: { 
            refreshing: false,
            error: ERRORS.noInternetConnection 
          }
        });
        return;
      }
      
      articleDispatch({
        type: ArticleActionTypes.FETCHED,
        payload: {
          loading: true,
          refreshing: false,
        }
      });
      
      try {
        
        const result = await ArticleRepository.getList();
        
        articleDispatch({
          type: ArticleActionTypes.FETCHED,
          payload: {
            list: result,
            loading: false,
            loaded: true
          }
        });
        
      } catch (error) {

        articleDispatch({
          type: ArticleActionTypes.FETCHED,
          payload: {
            loading: false,
            error: error instanceof FirebaseError ? error.code : ERRORS.unknown
          }
        });
      }
    },
    [connected, articleDispatch]
  );
  
  return [fetch, list, loading, loaded, refreshing, error, onRefresh, retryFetch];
}

