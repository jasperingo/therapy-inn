import React from "react";
import User from "../models/User";

export interface UserAction {
  type: string; 
  payload?: User; 
}

export enum UserActionTypes {
  FETCHED = 'USER_FETCHED',
  SIGNED_OUT = 'USER_SIGNED_OUT'
}

export default interface AppContextType {
  user: User | null;
  userDispatch: React.Dispatch<UserAction>;
}
