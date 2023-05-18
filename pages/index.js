import Header from '@/components/Header'
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import ItemList from '@/components/ItemList';

export default function Home() {
  const [ contractAddresses, setContractAddresses] =  useState([""]);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
    "0x4A21A8cd4957894912520a9E3230C094652035d1", 
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
    if(provider) {
      async function fetch() {
        const addresses = await contract.getTransactions();
        setContractAddresses(addresses);
      }
      fetch();
    }
  }, [])
  return (
    <main>
     <Header />
     {!contractAddresses ? (
        <p
        className="text-center animate-pulse text-blue-500"
        >Loading Listing</p>
      ) : (
        <ItemList contractAddresses={contractAddresses} isAccount={false} />
      )}
    </main>
  )
}
