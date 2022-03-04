import React from "react";
import Article from "../models/Article";
import User from "../models/User";

export interface UserAction {
  type: string; 
  payload?: User; 
}

export interface ArticleAction {
  type: string; 
  payload: Article; 
}

export enum UserActionTypes {
  FETCHED = 'USER_FETCHED',
  SIGNED_OUT = 'USER_SIGNED_OUT'
}

export default interface AppContextType {
  user: User | null;
  userDispatch: React.Dispatch<UserAction>;
  articles: Array<Article>;
  articleDispatch: React.Dispatch<ArticleAction>;
}
