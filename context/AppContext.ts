
import { createContext } from "react";
import ContextType from "./AppContextType";

const AppContext = createContext<ContextType | null>(null);

export default AppContext;

