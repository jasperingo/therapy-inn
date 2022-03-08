import { endBefore, get, getDatabase, limitToLast, onChildAdded, orderByChild, push, query, ref, set, startAt } from "firebase/database";
import Chat from "../models/Chat";
import Message from "../models/Message";
import firebaseApp, { PAGE_LIMIT } from "./firebase.config";

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

  async getList(messageingListId: string, page: number) {
    const db = getDatabase();
    const messagesRef = ref(db, `messages/${messageingListId}`);
    const orderConstraint = orderByChild('date');
    const limitConstraint = limitToLast(PAGE_LIMIT);
    const messagesQuery = page === 0 ?
      query(
        messagesRef,
        orderConstraint,
        limitConstraint
      )
      :
      query(
        messagesRef,
        orderConstraint, 
        endBefore(page),
        limitConstraint
      );
    
    const snapshots = await get(messagesQuery);
    
    const result: Array<Message> = [];

    snapshots.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childData: Message = childSnapshot.val();
      result.unshift({ ...childData, id: childKey as string });
    });
    
    return result;
  },

  getNew(messageingListId: string, onNewMessage: (message: Message)=> void) {
    const db = getDatabase();
    const messageListRef = ref(db, `messages/${messageingListId}`);
    return onChildAdded(
      query(
        messageListRef, 
        orderByChild('date'), 
        startAt(Date.now())
      ), 
      (data) => {
        const message = data.val() as Message;
        message.id = data.key as string;
        onNewMessage(message);
      }
    );
  }

};

export default MessageRepository;
