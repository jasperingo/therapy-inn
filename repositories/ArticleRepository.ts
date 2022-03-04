import { endBefore, getDatabase, limitToLast, onValue, orderByChild, push, query, ref, remove, set } from "firebase/database";
import { getStorage, uploadBytes, ref as StorageRef } from "firebase/storage";
import Article from "../models/Article";
import firebaseApp, { PAGE_LIMIT } from "./firebase.config";

const ArticleRepository = {

  async create(article: Article) {

    const db = getDatabase(firebaseApp);
    const articleListRef = ref(db, 'articles');
    const newArticleRef = push(articleListRef);
    await set(newArticleRef, article);
    return newArticleRef.key as string;
  },

  delete(article: Article) {
    const db = getDatabase(firebaseApp);
    return remove(ref(db, `articles/${article.id}`));
  },
  
  async updatePhoto(article: Article, photoBlob: Blob) {

    const storage = getStorage();

    const db = getDatabase(firebaseApp);

    const mountainsRef = StorageRef(storage, article.photoURL);

    await uploadBytes(mountainsRef, photoBlob);

    return set(ref(db, `articles/${article.id}`), { 
      link: article.link,
      title: article.title,
      photoURL: article.photoURL,
      creatdAt: article.creatdAt,
      userId: article.userId
    });
  },

  getList(page: number, onResult: (result: Array<Article>)=> void, onError: (error: Error)=> void) {
    
    const db = getDatabase();
    const alertsRef = page === 0 ?
      query(
        ref(db, 'articles'), 
        orderByChild('creatdAt'),
        limitToLast(PAGE_LIMIT)
      )
      :
      query(
        ref(db, 'articles'), 
        orderByChild('creatdAt'), 
        endBefore(page),
        limitToLast(PAGE_LIMIT)
      );
    
    onValue(
      alertsRef, 
      (snapshot) => {
        const result: Array<Article> = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          result.unshift({ ...childData, id: childKey });
        });
        onResult(result);
      }, 
      onError,
      {
        onlyOnce: true
      }
    );
  }

}

export default ArticleRepository;
