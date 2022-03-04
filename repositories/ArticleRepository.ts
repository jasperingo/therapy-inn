import { getDatabase, push, ref, set } from "firebase/database";
import { getStorage, uploadBytes, ref as StorageRef } from "firebase/storage";
import Article from "../models/Article";
import firebaseApp from "./firebase.config";

const ArticleRepository = {

  async create(article: Article) {

    const db = getDatabase(firebaseApp);
    const postListRef = ref(db, 'articles');
    const newPostRef = push(postListRef);
    await set(newPostRef, article);
    return newPostRef.key as string;
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
  }

}

export default ArticleRepository;
