
import { createContext } from "react";
import AppContextType, { ArticleStateType } from "./AppContextType";

export const articlestate: ArticleStateType = {
  list: [],
  loading: false,
  refreshing: false,
  loaded: false,
  error: null,
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
