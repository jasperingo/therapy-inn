import User from "../models/User";
import { UserAction, UserActionTypes } from "./AppContextType";

const UserReducer = (state: User | null, action: UserAction) => {

  switch(action.type) {

    case UserActionTypes.FETCHED:
      return action.payload !== undefined ? action.payload : state;

    case UserActionTypes.UNFETCHED:
      return null;

    default:
      return state;
  }
}

export default UserReducer;