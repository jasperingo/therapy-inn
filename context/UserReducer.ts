import User from "../models/User";
import { UserAction, UserActionTypes } from "./AppContextType";

const UserReducer = (state: User | null, action: UserAction) => {

  switch(action.type) {

    case UserActionTypes.FETCHED:
      return action.payload as User;

    case UserActionTypes.SIGNED_OUT:
      return null;

    default:
      return state;
  }
}

export default UserReducer;