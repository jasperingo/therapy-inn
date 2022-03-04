import Article from "../models/Article";
import { ArticleAction, UserActionTypes } from "./AppContextType";

const ArticleReducer = (state: Array<Article>, action: ArticleAction) => {

  switch(action.type) {


    default:
      return state;
  }
}

export default ArticleReducer;
