
import { createContext } from "react";
import AppContextType, { ArticleStateType } from "./AppContextType";

export const articlestate: ArticleStateType = {
  list: [],
  ended: false,
  loading: false,
  refreshing: false,
  page: -1,
  error: null,
};

const AppContext = createContext<AppContextType | null>(null);

export default AppContext;
