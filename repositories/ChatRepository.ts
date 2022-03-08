import { 
  endBefore, 
  get, 
  getDatabase, 
  limitToLast, 
  onChildAdded, 
  onChildChanged, 
  orderByChild, 
  query, 
  ref, 
  startAt, 
  update 
} from "firebase/database";
import Chat from "../models/Chat";
import { PAGE_LIMIT } from "./firebase.config";
import UserRepository from "./UserRepository";

const ChatRepository = {

  async getList(id: string, page: number) {
    
    const db = getDatabase();
    const chatsRef = ref(db, `chats/${id}`);
    const orderConstraint = orderByChild('date');
    const limitConstraint = limitToLast(PAGE_LIMIT);
    const chatsQuery = page === 0 ?
      query(
        chatsRef,
        orderConstraint,
        limitConstraint
      )
      :
      query(
        chatsRef,
        orderConstraint, 
        endBefore(page),
        limitConstraint
      );
    
    const snapshots = await get(chatsQuery);
    
    const result: Array<Chat> = [];
    
    snapshots.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData: Chat = childSnapshot.val();
      result.unshift({ ...childData, recipientId: childKey as string });
    });

    for(const item of result) {
      const user = await UserRepository.get(item.recipientId);
      item.recipientDisplayName = user.displayName;
      item.recipientPhoneNumber = user.phoneNumber;
      item.recipientPhotoURL = user.photoURL;
    }
    
    return result;
  },

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

  getChanged(userId: string, onNewMessage: (chat: Chat)=> void) {
    const db = getDatabase();
    const messageListRef = ref(db, `chats/${userId}`);
    return onChildChanged(
      query(messageListRef), 
      async (data) => {
        const chat = data.val() as Chat;
        chat.recipientId = data.key as string;
        const user = await UserRepository.get(chat.recipientId);
        chat.recipientDisplayName = user.displayName;
        chat.recipientPhoneNumber = user.phoneNumber;
        chat.recipientPhotoURL = user.photoURL;
        onNewMessage(chat);
      }
    );
  },

  getAdded(userId: string, onNewMessage: (chat: Chat)=> void) {
    const db = getDatabase();
    const messageListRef = ref(db, `chats/${userId}`);
    return onChildAdded(
      query(
        messageListRef,
        orderByChild('date'), 
        startAt(Date.now())
      ), 
      async (data) => {
        const chat = data.val() as Chat;
        chat.recipientId = data.key as string;
        const user = await UserRepository.get(chat.recipientId);
        chat.recipientDisplayName = user.displayName;
        chat.recipientPhoneNumber = user.phoneNumber;
        chat.recipientPhotoURL = user.photoURL;
        onNewMessage(chat);
      }
    );
  }

};

export default ChatRepository;
