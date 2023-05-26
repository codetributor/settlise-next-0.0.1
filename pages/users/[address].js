import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ItemList from '@/components/ItemList';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { UserContext } from '../../context/AccountContext';

export default function Home() {
  const router = useRouter()
  const { currentAccount, getCurrentContract } = UserContext();

  const [ type, setType ] = useState("buyer");
  const [ contractAddresses, setContractAddresses] =  useState([""]);

  useEffect(() => {
    const contract = getCurrentContract();
    if(contract && currentAccount) {
      async function fetch() {
        const addresses = await contract.getUserAddresses(currentAccount);
        setContractAddresses(addresses);
      }
      fetch();
    }
  }, [currentAccount, type])
  return (
    <main className="max-w-6xl mx-auto pb-10">
      <Header />
      <h1 className="text-gray-500 p-2 text-2xl">My Account</h1>
      <div className="p-2 flex-row space-x-2">
        <button onClick={() => {setType("seller")}}className=" border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Seller</button>
        <button onClick={() => {setType("buyer")}}className=" border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Buyer</button>
      </div>
      {!contractAddresses ? (
        <p
        className="text-center animate-pulse text-blue-500"
        >Loading Listing</p>
      ) : (
        <ItemList contractAddresses={contractAddresses} isAccount={true} type={type} userAddress={router.query.address} />
      )}
      
    </main>
  )
}