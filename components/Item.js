import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useMoralis } from 'react-moralis';
import {UserContext} from '../context/AccountContext'   // Mod1

function Item({address, type, isAccount, userAddress}) {

  const { currentAccount } = UserContext() // Mod2

  const [ ipfs, setIpfs] = useState("");
  const [ item, setItem] = useState("");
  const [ price, setPrice] = useState("");
  const [ seller, setSeller ] = useState("");
  const [ buyer, setBuyer ] = useState("");
  const [ bgCard, setBgCard] = useState("bg-gray-50")
  const [ bgCardHover, setBgCardHover ] = useState("hover:bg-gray-100")
  const [priceFeed, setPriceFeed] = useState(1)
  const [dollarPrice, setDollarPrice] = useState(0);

  const abi = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_ipfsImage",
          "type": "string"
        },
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
          "internalType": "address",
          "name": "_sellerAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_TxFactoryContractAddress",
          "type": "address"
        }
      ],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "Transfer__Failed",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "TxFactoryContractAddress",
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
      "inputs": [],
      "name": "buyerSettle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBuyerAddress",
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
      "inputs": [],
      "name": "getBuyerCollateral",
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
      "name": "getBuyerPhysicalAddress",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBuyerSettled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getCost",
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
      "name": "getDispute",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getFinalSettlement",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
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
      "name": "getIpfsImage",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getItem",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getLatestPrice",
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
      "name": "getPending",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getPrice",
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
      "name": "getSellerAddress",
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
      "inputs": [],
      "name": "getSellerCollateral",
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
      "name": "getSellerPhysicalAddress",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getSellerSettled",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTipForBuyer",
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
      "name": "getTipForSeller",
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
      "name": "getTotalContractBalance",
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
      "name": "getTransactionAddress",
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
      "inputs": [],
      "name": "ipfsImage",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_msgSender",
          "type": "address"
        }
      ],
      "name": "payOutBuyer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_msgSender",
          "type": "address"
        }
      ],
      "name": "payOutSeller",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_buyerPhysicalAddress",
          "type": "string"
        }
      ],
      "name": "purchase",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sellerRefund",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sellerSettle",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "setDispute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tipBuyer",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tipSeller",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];
  
  useEffect(() => {
    
    if(address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(address, abi, provider)
    if(contract) {
        async function getData() {
            const Ipfs = await contract.getIpfsImage();
            const Item = await contract.getItem();
            const Price = await contract.getPrice();
            const Seller = await contract.getSellerAddress();
            const Buyer = await contract.getBuyerAddress();
            const FinalSettlement = await contract.getFinalSettlement();
            const ethPrice = await contract.getLatestPrice()
            setPriceFeed(BigNumber.from(ethPrice["_hex"]).toString())
            setIpfs(Ipfs);
            setItem(Item);
            setPrice(Price);
            setSeller(Seller.toLowerCase())
            setBuyer(Buyer.toLowerCase())
            if(FinalSettlement) {
              setBgCard("bg-green-50")
              setBgCardHover("hover:bg-green-100")
            }
            const dollarEth = priceFeed/1e8;
            const convertDollar  = (price/1e18)*dollarEth;
            setDollarPrice(convertDollar);
            console.log(dollarPrice);
          }
          getData();
        }
      
    } 
  }, [address, priceFeed])

  // mod3
  let url
  if(!currentAccount){
    url = "/"
  } else{
    url = `/listing/${address}`
  }
  
  if(!price || !item || !ipfs || !seller || !address || !priceFeed || !dollarPrice) return
   
    if(isAccount) {
      if(type == "seller") {
        if(userAddress === seller) {
          return( 
          // <Link href={`/listing/${address}`}>
          <Link href={url}> 
          <div className={`flex flex-col card hover:scale-105 transition-all ${bgCard} ${bgCardHover} duration-150 ease-out`}>
          <div className="flex justify-center">
          <img className="h-64 w-64" height={300} widht={300} src={ipfs} alt="papareact icon" />
          </div>
          <h3>{item}</h3>
          <p>{`${Math.max( Math.round(dollarPrice * 100) / 100 ).toFixed(2)} USD`}</p>
          {`${address.slice(0,5)}...${address.slice(-4)}`}
        </div>
          </Link>);
        } else {
          return;
        }
      } else {
        if(userAddress === buyer) {
          return( 
          // <Link href={`/listing/${address}`}>
          <Link href={url}> 
          <div className={`flex flex-col card hover:scale-105 transition-all ${bgCard} ${bgCardHover} duration-150 ease-out`}>
          <div className="flex justify-center">
          <img className="h-64 w-64" height={300} widht={300} src={ipfs} alt="papareact icon" />
          </div>
          <h3>{item}</h3>
          <p>{`${Math.max( Math.round(dollarPrice * 100) / 100 ).toFixed(2)} USD`}</p>
          {`${address.slice(0,5)}...${address.slice(-4)}`}
        </div>
          </Link>);
        } else {
          return;
        }
      }
    } else {
      return (
        // mod4
        // <Link href={`/listing/${address}`}>
        <Link href={url}> 
        <div className={`flex flex-col card hover:scale-105 transition-all ${bgCard} ${bgCardHover} duration-150 ease-out`}>
        <div className="flex justify-center">
        <img className="h-64 w-64" height={300} widht={300} src={ipfs} alt="papareact icon" />
        </div>
        <h3>{item}</h3>
        <p>{`${Math.max( Math.round(dollarPrice * 100) / 100 ).toFixed(2)} USD`}</p>
        {`${address.slice(0,5)}...${address.slice(-4)}`}
      </div>
        </Link>
    )
    }
}

export default Item