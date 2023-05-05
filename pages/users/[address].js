import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import ItemList from '@/components/ItemList';
import { useRouter } from 'next/router';
import { ethers } from 'ethers';
import { useMoralis } from 'react-moralis';

export default function Home() {
  const router = useRouter()
  const { account } = useMoralis();

  const [ type, setType ] = useState("buyer");

//   const { contract } = useContract("0x84eb9bE781cFD4A2BcE9EBc0B6D53f1983070828");
//   const { data: contractAddresses, isLoading } = useContractRead(contract, "getUserAddresses", [router.query.address])
const [ contractAddresses, setContractAddresses] =  useState([""]);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
    "0x84eb9bE781cFD4A2BcE9EBc0B6D53f1983070828", 
    [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "_contractAddress",
            "type": "address"
          }
        ],
        "name": "Created",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_item",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "_price",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "_sellerPhysicalAddress",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_ipfsImage",
            "type": "string"
          }
        ],
        "name": "createTxContract",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getLengthOfTransactionArray",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "getTransaction",
        "outputs": [
          {
            "internalType": "address",
            "name": "_transactionAddress",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getTransactions",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_userAddress",
            "type": "address"
          }
        ],
        "name": "getUserAddresses",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_transactionAddress",
            "type": "address"
          }
        ],
        "name": "removeFromPublicArray",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_transactionAddress",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_seller",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_buyer",
            "type": "address"
          }
        ],
        "name": "removeTx",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "s_transactionsArray",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_buyer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_txContractAddress",
            "type": "address"
          }
        ],
        "name": "setBuyerTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_seller",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_txContractAddress",
            "type": "address"
          }
        ],
        "name": "setTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "transactions",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    provider)
    if(provider && account) {
      async function fetch() {
        const addresses = await contract.getUserAddresses(account);
        setContractAddresses(addresses);
      }
      fetch();
    }
  }, [account, type])
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