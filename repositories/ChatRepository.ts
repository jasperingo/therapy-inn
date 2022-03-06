import { endBefore, get, getDatabase, limitToLast, orderByChild, query, ref } from "firebase/database";
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
  }

};

export default ChatRepository;
