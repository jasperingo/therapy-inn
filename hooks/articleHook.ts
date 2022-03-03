import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import ERRORS from "../assets/values/errors";
import Article from "../models/Article";
import ArticleRepository from "../repositories/ArticleRepository";
import { useAuthUser } from "./userHook";

export const useArticleCreate = ()=> {

  const user = useAuthUser();

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
      id: '',
      creatdAt: Date.now(),
      title,
      link,
      photoURL: '',
      userId: user?.uid as string
    }

    try {
      await ArticleRepository.create(article, photoBlob);
      setSuccess(true);
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

