import { FirebaseError } from "firebase/app";
import { useCallback, useState } from "react";
import ERRORS from "../assets/values/errors";
import Article from "../models/Article";
import ArticleRepository from "../repositories/ArticleRepository";
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

