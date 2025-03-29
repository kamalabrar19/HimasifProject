import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';

// Simpan chat ke Firestore
export const saveChatToFirestore = async (userId, userMessage, aiResponse) => {
  try {
    const chatRef = collection(db, 'users', userId, 'chat_history');
    await addDoc(chatRef, {
      user_message: userMessage,
      ai_response: aiResponse,
      timestamp: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error saving chat to Firestore:', error);
    return false;
  }
};

// Ambil riwayat chat dari Firestore
export const getChatHistoryFromFirestore = async (userId, limitCount = 20) => {
  try {
    const chatRef = collection(db, 'users', userId, 'chat_history');
    const q = query(
      chatRef,
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const chatHistory = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      chatHistory.push({
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date()
      });
    });
    
    // Kembalikan dalam urutan kronologis
    return chatHistory.reverse();
  } catch (error) {
    console.error('Error getting chat history from Firestore:', error);
    return [];
  }
};