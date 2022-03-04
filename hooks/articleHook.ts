import { FirebaseError } from "firebase/app";
import { useCallback, useEffect, useState } from "react";
import ERRORS from "../assets/values/errors";
import { ArticleActionTypes } from "../context/AppContextType";
import Article from "../models/Article";
import ArticleRepository from "../repositories/ArticleRepository";
import { PAGE_LIMIT } from "../repositories/firebase.config";
import { useAppContext } from "./contextHook";
import { usePhotoURLMaker } from "./photoHook";
import { useAuthUser } from "./userHook";

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
      setSuccess(false)
    },
    []
  );

  const onSubmit = async (title: string, link: string, photoBlob: Blob) => {
    
    setLoading(true);

    const article: Article = {
      link,
      title,
      id: '',
      photoURL: '',
      creatdAt: Date.now(),
      userId: user?.uid as string
    }

    try {
      article.id = await ArticleRepository.create(article);

      article.photoURL = photoURLMaker(article.id, photoBlob.type);

      await ArticleRepository.updatePhoto(article, photoBlob);

      setSuccess(true);

      articleDispatch({
        payload: article,
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
        payload: article,
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
  ()=> void,
  Array<Article>, 
  boolean, 
  number,
  boolean,
  string | null, 
  ()=> void
];

export const useArticleFetch = (): FetchReturnType => {

  const { 
    articles: { 
      list,
      ended,
      loading,
      refreshing,
      page,
      error
    },
    articleDispatch
  } = useAppContext();
  
  const onRefresh = useCallback(
    ()=> { 
     articleDispatch({ type: ArticleActionTypes.UNFETCHED });
    }, 
    [articleDispatch]
  );
  
  const fetch = useCallback(
    () => {
      articleDispatch({
        type: ArticleActionTypes.FETCHED,
        payload: {
          page: page === -1 ? 0 : page,
          error: error !== null ? null : error,
          loading: !loading && !ended ? true : loading
        }
      });
    },
    [page, error, loading, ended, articleDispatch]
  );
  
  useEffect(
    () => {

      const fetch = ()=> {
        ArticleRepository.getList(
          page,
          (result)=> {
            articleDispatch({
              type: ArticleActionTypes.FETCHED,
              payload: {
                list: result,
                loading: false,
                refreshing: false,
                ended: result.length < PAGE_LIMIT,
                page: result[result.length-1]?.creatdAt
              }
            });
          },
          (error)=> {
            articleDispatch({
              type: ArticleActionTypes.FETCHED,
              payload: {
                loading: false,
                refreshing: false,
                error: error instanceof FirebaseError ? error.code : ERRORS.unknown
              }
            });
          }
        );
      }

      if (loading && !ended) fetch();
    },
    [loading, ended, page, articleDispatch]
  );
  
  return [fetch, list, loading, page, refreshing, error, onRefresh];
}

