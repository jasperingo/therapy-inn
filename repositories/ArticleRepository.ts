import { endBefore, get, getDatabase, limitToLast, orderByChild, push, query, ref, remove, set } from "firebase/database";
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

  async getList(page: number) {
    
    const db = getDatabase();
    const articlesRef = ref(db, 'articles');
    const orderConstraint = orderByChild('creatdAt');
    const limitConstraint = limitToLast(PAGE_LIMIT);
    const articlesQuery = page === 0 ?
      query(
        articlesRef,
        orderConstraint,
        limitConstraint
      )
      :
      query(
        articlesRef,
        orderConstraint, 
        endBefore(page),
        limitConstraint
      );
    
    const snapshots = await get(articlesQuery);
    
    const result: Array<Article> = [];

    snapshots.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      result.unshift({ ...childData, id: childKey });
    });
    
    return result;
  }

}

export default ArticleRepository;
