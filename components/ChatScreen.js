import React, { useEffect, useRef, useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, doc, setDoc, onSnapshot, serverTimestamp, query, orderBy, timeStamp } from "firebase/firestore";
import { useMoralis } from 'react-moralis'; 


function ChatScreen({contractAddress}) {

  const { account } = useMoralis();

  const [ message, setMessage ] = useState("");
  const [ messages, setMessages ] = useState([]);

  const endOfMessages = useRef();

  useEffect(() => {
    const collRef = collection(db, `chats/${contractAddress}/messages`);
    const messList = query(collRef, orderBy("timeStamp", "asc"));
    const unsubscribe =  async () => {
        onSnapshot(messList, (snapShot) => {
            const data = [];
            snapShot.forEach(doc => {
                data.push({
                    id: doc.id,
                    message: doc.data().message,
                    user: doc.data().user,
                    timeStamp: doc.data({ serverTimestamps: 'estimate' }).timeStamp.toDate()
                })
            })
            setMessages(data);
        })
    }
    unsubscribe();
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()

    let collRef = await collection(db, `chats/${contractAddress}/messages`);
    await addDoc(collRef, {
        message: message,
        user: account,
        timeStamp: serverTimestamp()
    })
    .catch(e => alert(e))
    setMessage("");
    scrollToBottom();
  }
  const scrollToBottom = () => {
    endOfMessages.current.scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
  return (
    <div className="max-w-6xl mx-auto px-0 md:px-5 bg-gray-50">
      <div className="max-w-6xl overflow-scroll overflow-y-hidden overflow-x-hidden h-90v mx-auto px-0 md:px-5 text-xs md:text-lg bg-gray-50 p-2">
        {messages.map(data => (
        data.user == account ? (
            <div key={data.id} className="relative flex-wrap max-w-xs">
                <p 
                style={{
                  wordBreak: "break-all"
                }}
                className="text-left bg-blue-100 w-fit m-7 px-5 py-2 rounded-full">{data.message}</p>
                <p className="text-xs absolute -bottom-5 left-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
            </div>
        ) : (
            <div key={data.id} className="relative flex-wrap ml-auto max-w-xs">
                <p 
                style={{
                  wordBreak: "break-all"
                }}
                className="bg-white w-fit m-7 px-5 py-2 rounded-full">{data.message}</p>
                <p className="text-xs absolute -bottom-5 right-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
            </div>
            
        )
      ))}
      <div ref={endOfMessages}></div>
    </div>
    <form className="flex flex-row">
        <input className="w-full m-2 p-2" value={message} onChange={e => setMessage(e.target.value)} type="text" />
        <button
        type="submit"
        className="m-2"
        onClick={sendMessage}
        >Send</button>
      </form>
    </div>
    
  )
}

export default ChatScreen