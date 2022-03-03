import { getDatabase, push, ref, set } from "firebase/database";
import { getStorage, uploadBytes, ref as StorageRef } from "firebase/storage";
import Article from "../models/Article";
import firebaseApp from "./firebase.config";

const ArticleRepository = {

  async create(article: Article, photoBlob: Blob) {

    const db = getDatabase(firebaseApp);
    const postListRef = ref(db, 'alerts');
    const newPostRef = push(postListRef);
    await set(newPostRef, alert);
    article.id = newPostRef.key as string;

    const storage = getStorage();

    const mountainsRef = StorageRef(storage, '');

    await uploadBytes(mountainsRef, photoBlob);

    return article;
  }

}

export default ArticleRepository;
