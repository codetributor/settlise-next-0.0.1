import React, { useEffect, useRef, useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { addDoc, collection, doc, setDoc, onSnapshot, serverTimestamp, query, orderBy, timeStamp } from "firebase/firestore";
import { useMoralis } from 'react-moralis'; 
import { PaperClipIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { UserContext } from '@/context/AccountContext';

function ChatScreen({contractAddress}) {

  const { currentAccount } = UserContext();

  const [ message, setMessage ] = useState("");
  const [ messages, setMessages ] = useState([]);
  const [ image, setImage ] = useState(null);
  const [ imageInput, setImageInput ] = useState(null);
  const [ imageSrc, setImageSrc ] = useState("");
  const [ app, setApp ] = useState(null);
  const [ db, setDb] = useState(null)

  const endOfMessages = useRef();

  useEffect(() => {
    let firebaseConfig
  // Your web app's Firebase configuration
  fetch(process.env.NEXT_PUBLIC_CREDENTIALS)
  .then(result => result.json())
  .then(data => {

  firebaseConfig = {
    apiKey: data.apiKey,
    authDomain: data.authDomain,
    projectId: data.projectId,
    storageBucket: data.storageBucket,
    messagingSenderId: data.messagingSenderId,
    appId: data.appId
  };

if(app) {
    app
} else {
    initializedApp = initializeApp(firebaseConfig);
    setApp(initializeApp);
}
    initializedDb = getFirestore(app);
    setDb(initializedDb);

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
})
    
    
  }, [])

  const sendMessage = async (e) => {
    e.preventDefault()

    if(imageInput) {
      const formData = new FormData();
      formData.append('file', imageInput)
      formData.append('upload_preset', 'my-uploads');

      const data = await fetch('https://api.cloudinary.com/v1_1/duvfr5qnr/image/upload', {
        method: "POST",
        body: formData
      })
      .then(res => res.json());
      setImageSrc(data.secure_url);
      if(imageSrc) {
        let collRef = await collection(db, `chats/${contractAddress}/messages`);
      await addDoc(collRef, {
          message: imageSrc,
          user: currentAccount,
          timeStamp: serverTimestamp()
      })
      .catch(e => alert(e))
      setImageInput(null);
      setImage(null);
      scrollToBottom();
      }
    } else {
      if(!message) return
      let collRef = await collection(db, `chats/${contractAddress}/messages`);
      await addDoc(collRef, {
          message: message,
          user: currentAccount,
          timeStamp: serverTimestamp()
      })
      .catch(e => alert(e))
      setMessage("");
      scrollToBottom();
    }

   
  }
  const handleImage = (e) => {
    e.preventDefault();

    const file = e.target.files[0];
    setImageInput(file);
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      setImage(e.target.result);
    }
    if(file) {
      fileReader.readAsDataURL(file);
    }
    setTimeout(scrollToBottom, 1000);
  }
  const clearUpload = () => {
    setImage(null);
    setImageInput(null)
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
          data.message.startsWith("https://res.cloudinary.com") ? (
            data.user == currentAccount ? (
              <div key={data.id} className="relative m-7 px-5 py-2">
              <img className="mr-auto" src={data.message} height={200} width={200}></img>
              <p className="text-xs absolute -bottom-5 left-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
            </div> 
            ) : (
              <div key={data.id} className="relative m-7 px-5 py-2">
              <img className="ml-auto"src={data.message} height={200} width={200}></img>
              <p className="text-xs absolute -bottom-5 right-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
            </div> 
            )
            
          ) : (data.user == currentAccount ? (
            <div key={data.id} className="relative flex-wrap flex max-w-xs">
                <p 
                style={{
                  wordWrap: "wrap"
                }}
                className="text-left bg-blue-100 w-fit m-7 px-5 py-2 rounded-full">{data.message}</p>
                <p className="text-xs absolute bottom-0 left-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
            </div>
        ) : (
            <div key={data.id} className="relative flex-wrap ml-auto max-w-xs">
                <div className="flex justify-end">
                <p 
               style={{
                wordWrap: "wrap"
              }}
                className="bg-white text-right w-fit m-7 px-5 py-2 rounded-full">{data.message}</p>
                <p className="text-xs absolute bottom-0 right-9 text-gray-500">from: {data.user.slice(0,4) + "..." + data.user.slice(-4)}</p>
                </div>
                
            </div>
            
        ))
        
      ))}
      <div className="max-w-6xl px-0 md:px-7">
        {image ? (
          <div className="relative">
             <div onClick={clearUpload} className='absolute bg-white p-1 rounded-full -left-2 -top-2'>
              <TrashIcon height={10} width={10}/>
              </div>
             <img src={image} height={200} width={200} />
          </div>
         
        ) : ("")}
      </div>
      <div ref={endOfMessages}></div>
    </div>
    <form className="flex flex-row justify-center items-center">
        <label htmlFor="file">
          <PaperClipIcon height="30" width="30" />
        </label>
        <input 
        style={{
          display: "none" 
        }}
        type="file" id="file" accept="image/*" onChange={handleImage} />
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