import { 
  onChildAdded, 
  onChildChanged, 
  ref, 
  update ,
  getDatabase,
  get,
  query,
  limitToLast,
  orderByChild,
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

  async getList(userId: string) {
    
    const db = getDatabase();
    const chatsRef = ref(db, `chats/${userId}`);
    const orderConstraint = orderByChild('date');

    const snapshots = await get(query(chatsRef, orderConstraint));
    
    const result: Array<Chat> = [];

    snapshots.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData = childSnapshot.val();
      result.unshift({ ...childData, recipientId: childKey });
    });

    for (const item of result) {
      const user = await UserRepository.get(item.recipientId);
      item.recipientDisplayName = user.displayName;
      item.recipientPhoneNumber = user.phoneNumber;
      item.recipientPhotoURL = user.photoURL;
    }
    
    return result;
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

  getCreate(userId: string, onSuccess: (chat: Chat)=> void, onError: (error: Error) => void) {
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
