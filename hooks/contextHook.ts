import { useContext } from "react";
import AppContext from "../context/AppContext";
import AppContextType from "../context/AppContextType";

export const useAppContext = ()=> {
  const cxt = useContext(AppContext);
  return cxt as AppContextType;
}

