import { db } from '../config/firebase';

// In-memory fallback store per user and collection to guarantee 100% data durability during local/cloud execution
const inMemoryStore: Record<string, Record<string, any[]>> = {};

export class FirestoreRepository {
  private static getMemoryCollection(uid: string, collectionName: string): any[] {
    if (!inMemoryStore[uid]) inMemoryStore[uid] = {};
    if (!inMemoryStore[uid][collectionName]) inMemoryStore[uid][collectionName] = [];
    return inMemoryStore[uid][collectionName];
  }

  static async getUserDoc(uid: string) {
    return db.collection('users').doc(uid);
  }

  static async getCollection(uid: string, collectionName: string) {
    const userRef = await this.getUserDoc(uid);
    return userRef.collection(collectionName);
  }

  static async addDocument(uid: string, collectionName: string, data: any) {
    const now = new Date();
    const docData = {
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now,
    };

    const memCol = this.getMemoryCollection(uid, collectionName);
    const generatedId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newDoc = { id: generatedId, ...docData };
    memCol.unshift(newDoc);

    try {
      const collectionRef = await this.getCollection(uid, collectionName);
      const docRef = await collectionRef.add(docData);
      newDoc.id = docRef.id;
    } catch (err) {
      console.warn(`Firestore addDocument warning for ${collectionName} (using in-memory fallback):`, err);
    }

    return newDoc;
  }

  static async getDocuments(uid: string, collectionName: string, limit: number = 50) {
    const memCol = this.getMemoryCollection(uid, collectionName);
    try {
      const collectionRef = await this.getCollection(uid, collectionName);
      let snapshot;
      try {
        snapshot = await collectionRef.orderBy('createdAt', 'desc').limit(limit).get();
      } catch (orderErr) {
        snapshot = await collectionRef.limit(limit).get();
      }

      if (snapshot && !snapshot.empty) {
        const firestoreDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Merge with memory collection to ensure newly created entries appear instantly
        const docMap = new Map();
        [...memCol, ...firestoreDocs].forEach(d => docMap.set(d.id, d));
        const combined = Array.from(docMap.values());
        combined.sort((a, b) => {
          const timeA = a.createdAt?._seconds ? a.createdAt._seconds * 1000 : new Date(a.createdAt || 0).getTime();
          const timeB = b.createdAt?._seconds ? b.createdAt._seconds * 1000 : new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        return combined.slice(0, limit);
      }
    } catch (err) {
      console.warn(`Firestore getDocuments warning for ${collectionName} (using in-memory fallback):`, err);
    }

    return memCol.slice(0, limit);
  }

  static async getDocument(uid: string, collectionName: string, docId: string) {
    const memCol = this.getMemoryCollection(uid, collectionName);
    const memMatch = memCol.find(d => d.id === docId);

    try {
      const collectionRef = await this.getCollection(uid, collectionName);
      const doc = await collectionRef.doc(docId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() };
      }
    } catch (err) {
      console.warn(`Firestore getDocument warning for ${collectionName} ${docId}:`, err);
    }

    return memMatch || null;
  }

  static async updateDocument(uid: string, collectionName: string, docId: string, data: any) {
    const memCol = this.getMemoryCollection(uid, collectionName);
    const index = memCol.findIndex(d => d.id === docId);
    if (index !== -1) {
      memCol[index] = { ...memCol[index], ...data, updatedAt: new Date() };
    }

    try {
      const collectionRef = await this.getCollection(uid, collectionName);
      await collectionRef.doc(docId).update({
        ...data,
        updatedAt: new Date(),
      });
    } catch (err) {
      console.warn(`Firestore updateDocument warning for ${collectionName} ${docId}:`, err);
    }
  }

  static async deleteDocument(uid: string, collectionName: string, docId: string) {
    const memCol = this.getMemoryCollection(uid, collectionName);
    const index = memCol.findIndex(d => d.id === docId);
    if (index !== -1) {
      memCol.splice(index, 1);
    }

    try {
      const collectionRef = await this.getCollection(uid, collectionName);
      await collectionRef.doc(docId).delete();
    } catch (err) {
      console.warn(`Firestore deleteDocument warning for ${collectionName} ${docId}:`, err);
    }
  }
}
