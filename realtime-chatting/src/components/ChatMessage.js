import React from "react";
import tempImg from "../assets/person.png";

function ChatMessage({ messages, auth }) {
  //   console.log(messages);
  //   console.log(auth);
  const { uid, photoURL, text } = messages;
  //   console.log(uid);

  const messageClass = uid === auth?.currentUser.uid ? "sent" : "received";
  // 첫번쨰 uid 는 파이어베이스에 저장되어있는 uid 이고
  // auth.currentUser.uid 는 로그인 한 대상의 uid를 뽑아 온것이다.
  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default ChatMessage;
