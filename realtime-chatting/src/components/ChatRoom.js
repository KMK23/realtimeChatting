import React, { useEffect, useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import ChatMessage from "./ChatMessage";
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { addDatas, db, getQuery, getRealTimeMessages } from "../api/firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";
function ChatRoom({ auth }) {
  const [inputValue, setInputValue] = useState("");
  // const [messages, setMessages] = useState([]);
  const conditions = [];
  const orderBys = [{ field: "createdAt", direction: "asc" }];
  const LIMITS = 100;
  const q = getQuery("messages", { conditions, orderBys, limits: LIMITS });
  const [messages] = useCollectionData(q);
  const dummy = useRef();

  const sendMessage = async (e) => {
    e.preventDefault();
    //저장할 데이터 객체를 생성한다.(text,createdAt,photoURL, uid)
    const { uid, photoURL } = auth?.currentUser;
    // 옵셔널체이닝 건 이유는 인증이 안되어있으면 안넘어가게
    const addObj = {
      text: inputValue,
      createdAt: serverTimestamp(),
      // firebase 함수야. 실시간 시간이 들어가
      uid: uid,
      photoURL: photoURL,
    };
    //데이터 베이스에 객체를 저장한다.
    const result = await addDatas("messages", addObj);
    console.log(result);
    //inputValue를 빈 문자열로 셋팅한다.
    setInputValue("");
  };

  // useEffect(() => {
  //   // const collect = collection(db, "messages");
  //   // const q = query(collect, orderBy("createdAt"), limit(100));
  //   // const unsubscribe = onSnapshot(q, async (snapshot) => {
  //   //   console.log(snapshot.docs);
  //   //   const result = snapshot.docs.map((doc) => doc.data());
  //   //   console.log(result);
  //   //   setMessages(result);
  //   //   console.log(messages);
  //   // });
  //   const unsubscribe = getRealTimeMessages("messages", setMessages);
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useEffect(() => {
    //scrollIntoView() 함수는 자신이 호출된 요소가 사용자에게 표시되도록
    //상위 컨테이너를 스크롤한다. ==> 한개의 파라미터 가능. boolean or {}
    // boolean => true 이면 스크롤 제일 위에, false면 제일 아래로 내림
    // {}안에는 두개 가능한데 block 에는 4개 가능 end, center, start,
    // inline도 있다. block/inline
    dummy.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [messages]);
  return (
    <>
      <main>
        {messages?.map((content) => {
          return (
            <ChatMessage
              messages={content}
              key={content.createdAt}
              auth={auth}
            />
          );
        })}
        <span ref={dummy}></span>
      </main>
      <form onSubmit={sendMessage}>
        <input
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button type="submit" disabled={!inputValue}>
          <FaIcons.FaPaperPlane />
        </button>
      </form>
    </>
  );
}

export default ChatRoom;
