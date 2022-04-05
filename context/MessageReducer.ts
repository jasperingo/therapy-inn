import { MessageAction } from "./AppContextType";

const MessageReducer = (state: string, action: MessageAction) => {

  switch(action.type) {

    case 'MESSAGE_FETCHED':
      return  action.payload;

    default:
      return state;
  }
}

export default MessageReducer;
