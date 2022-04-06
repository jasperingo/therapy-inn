import {
  get,
  getDatabase, 
  onChildAdded, 
  orderByChild, 
  push, 
  query, 
  ref, 
  set
} from "firebase/database";
import Chat from "../models/Chat";
import Message from "../models/Message";
import firebaseApp from "./firebase.config";

const MessageRepository = {

  async create(message: Message, messageingListId?: string) {
    
    const db = getDatabase(firebaseApp);

    const newMessagesRef = 
      messageingListId === undefined ? 
      push(ref(db, 'messages')) : 
      ref(db, `messages/${messageingListId}`);

    const newMessageRef = push(newMessagesRef);
    await set(newMessageRef, message);

    await set(ref(db, `chats/${message.senderId}/${message.receiverId}`), {
      date: Date.now(),
      message: message.content,
      read: true,
      id: messageingListId ?? newMessagesRef.key
    } as Chat);

    await set(ref(db, `chats/${message.receiverId}/${message.senderId}`), {
      date: Date.now(),
      message: message.content,
      read: false,
      id: messageingListId ?? newMessagesRef.key
    } as Chat);
    
    return [newMessageRef.key as string, newMessagesRef.key as string] as [messageId: string, messagingListId: string];
  },

  async getList(messageingListId: string) {
    const db = getDatabase();
    const messagesRef = ref(db, `messages/${messageingListId}`);
    const orderConstraint = orderByChild('date');
    const messagesQuery = query(messagesRef, orderConstraint);
    
    const snapshots = await get(messagesQuery);
    
    const result: Array<Message> = [];

    snapshots.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData: Message = childSnapshot.val();
      result.unshift({ ...childData, id: childKey as string });
    });
    
    return result;
  },

  getCreate(messageingListId: string, onNewMessage: (message: Message)=> void, onError: (error: Error) => void) {
    const db = getDatabase();
    return onChildAdded(
      ref(db, `messages/${messageingListId}`), 
      (data) => {
        const message = data.val() as Message;
        message.id = data.key as string;
        onNewMessage(message);
      },
      onError
    );
  },
};

export default MessageRepository;
