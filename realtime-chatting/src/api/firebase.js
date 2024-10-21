import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  limit,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBeVN97OEIfGXZUVLvRsN635iMiPvhlOIM",
  authDomain: "chatting-c37e8.firebaseapp.com",
  projectId: "chatting-c37e8",
  storageBucket: "chatting-c37e8.appspot.com",
  messagingSenderId: "652655593089",
  appId: "1:652655593089:web:d06ed18a884079cc782f80",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function getCollection(collectionName) {
  return collection(db, collectionName);
}

function getUserAuth() {
  return auth;
}

async function addDatas(collectionName, dataObj) {
  const result = await addDoc(getCollection(collectionName), dataObj);
  return result;
}

async function getRealTimeMessages(collectionName, setData) {
  const collect = collection(db, collectionName);
  const q = query(collect, orderBy("createdAt"), limit(100));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const result = snapshot.docs.map((doc) => doc.data());
    setData(result);
  });
  return unsubscribe;
}

function getQuery(collectionName, queryOption) {
  const { conditions = [], orderBys = [], limits } = queryOption;
  const collect = getCollection(collectionName);
  let q = query(collect);

  //where 조건
  conditions.forEach((condition) => {
    q = query(q, where(condition.field, condition.operator, condition.value));
  });

  //orderBy 조건
  orderBys.forEach((order) => {
    q = query(q, orderBy(order.field, order.direction || "asc"));
  });

  //limit 조건
  q = query(q, limit(limits));

  return q;
}
export { getUserAuth, addDatas, db, getRealTimeMessages, getQuery };
