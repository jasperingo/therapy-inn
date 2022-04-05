import { 
  onChildAdded, 
  onChildChanged, 
  ref, 
  update ,
  getDatabase,
  get,
  query,
  limitToLast, 
} from "firebase/database";
import Chat from "../models/Chat";
import UserRepository from "./UserRepository";

const ChatRepository = {

  update(chat: Chat, userId: string) {
    const db = getDatabase();
    const chatListRef = ref(db, `chats/${userId}`);
    return update(chatListRef, {
      [chat.recipientId]: {
        date: chat.date,
        message: chat.message,
        read: chat.read,
        id: chat.id
      }
    });
  },

  getUpdate(userId: string, onSuccess: (chat: Chat)=> void, onError: (error: Error) => void) {
    const db = getDatabase();
    const messageListRef = ref(db, `chats/${userId}`);
    return onChildChanged(
      messageListRef, 
      async (data) => {
        const chat = data.val() as Chat;
        chat.recipientId = data.key as string;
        const user = await UserRepository.get(chat.recipientId);
        chat.recipientDisplayName = user.displayName;
        chat.recipientPhoneNumber = user.phoneNumber;
        chat.recipientPhotoURL = user.photoURL;
        onSuccess(chat);
      },
      onError
    );
  },

  getAll(userId: string, onSuccess: (chat: Chat)=> void, onError: (error: Error) => void) {
    const db = getDatabase();
    return onChildAdded(
      ref(db, `chats/${userId}`),
      async (data) => {
        const chat = data.val() as Chat;
        chat.recipientId = data.key as string;
        const user = await UserRepository.get(chat.recipientId);
        chat.recipientDisplayName = user.displayName;
        chat.recipientPhoneNumber = user.phoneNumber;
        chat.recipientPhotoURL = user.photoURL;
        onSuccess(chat);
      },
      onError
    );
  },

  async exists(userId: string) {
    const db = getDatabase();
    
    const snapshot = await get(query(
      ref(db, `chats/${userId}`),
      limitToLast(1)
    ));
    
    return snapshot.exists();
  }

};

export default ChatRepository;
