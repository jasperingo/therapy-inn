import React from "react";
import Article from "../models/Article";
import User from "../models/User";

export interface UserAction {
  type: string; 
  payload?: User; 
}

export interface ArticleAction {
  type: string; 
  payload?: Partial<ArticleStateType & { article: Article }>; 
}

export interface MessageAction {
  type: 'MESSAGE_FETCHED'; 
  payload: string; 
}

export enum UserActionTypes {
  FETCHED = 'USER_FETCHED',
  UNFETCHED = 'USER_UNFETCHED'
}

export enum ArticleActionTypes {
  UNFETCHED = 'ARTICLE_UNFETCHED',
  FETCHED = 'ARTICLE_FETCHED',
  CREATED = 'ARTICLE_CREATED',
  DELETED = 'ARTICLE_DELETED'
}

export interface ArticleStateType {
  list: Array<Article>;
  loading: boolean;
  refreshing: boolean;
  loaded: boolean;
  error: string | null;
}

export default interface AppContextType {
  user: User | null;
  userDispatch: React.Dispatch<UserAction>;
  articles: ArticleStateType;
  articleDispatch: React.Dispatch<ArticleAction>;
  message: string;
  messageDispatch: React.Dispatch<MessageAction>;
}
