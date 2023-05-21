import { useRouter } from 'next/router';
import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useMoralis} from 'react-moralis';
import Link from 'next/link';
import ChatScreen from '@/components/ChatScreen';

export default function ListingPage() {

  const { account } = useMoralis();

  const router = useRouter();
  const [ ipfs, setIpfs] = useState("");
  const [ item, setItem] = useState("");
  const [ price, setPrice] = useState("");
  const [ sellerCollateral, setSellerCollateral] = useState("");
  const [buyerCollateral, setBuyerCollateral] = useState("");
  const [tipForSeller, setTipForSeller] = useState("");
  const [tipForBuyer, setTipForBuyer] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [finalSettlement, setFinalSettlement] = useState(false);
  const [tipForSellerInput, setTipForSellerInput] = useState("");
  const [tipForBuyerInput, setTipForBuyerInput] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [sellerPhysicalAddress, setSellerPhysicalAddress] = useState("");
  const [buyerPhysicalAddress, setBuyerPhysicalAddress] = useState("");
  const [priceFeed, setPriceFeed] = useState(1)
  const [dollarPrice, setDollarPrice] = useState(0);
  const [sellerCollateralDollar, setSellerCollateralDollar] = useState(0);
  const [buyerCollateralDollar, setBuyerCollateralDollar] = useState(0);
  const [tipForSellerDollar, setTipForSellerDollar] = useState(0);
  const [tipForBuyerDollar, setTipForBuyerDollar] = useState(0);
  const [warningMsg,setWarningMsg] = useState("")
  
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
      if(router.query.address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(router.query.address, abi, provider)
        if(provider) {
          async function getData() {
              const Ipfs = await contract.getIpfsImage();
              const Item = await contract.getItem();
              const Price = await contract.getPrice();
              const SellerCollateral = await contract.getSellerCollateral();
              const BuyerCollateral = await contract.getBuyerCollateral();
              const TipForSeller = await contract.getTipForSeller();
              const TipForBuyer = await contract.getTipForBuyer();
              const FinalSettlement = await contract.getFinalSettlement();
              const SellerAddress = await contract.getSellerAddress();
              const BuyerAddress = await contract.getBuyerAddress();
              const SellerPhysicalAddress = await contract.getSellerPhysicalAddress();
              const BuyerPhysicalAddress = await contract.getBuyerPhysicalAddress();
              const ethPrice = await contract.getLatestPrice()
              
              setPriceFeed(BigNumber.from(ethPrice["_hex"]).toString());
              setIpfs(Ipfs);
              setItem(Item);
              setPrice(Price);
              setSellerCollateral(SellerCollateral);
              setBuyerCollateral(BuyerCollateral);
              setTipForSeller(TipForSeller);
              setTipForBuyer(TipForBuyer);
              setFinalSettlement(FinalSettlement);
              setSellerAddress(SellerAddress);
              setBuyerAddress(BuyerAddress);
              setSellerPhysicalAddress(SellerPhysicalAddress);
              setBuyerPhysicalAddress(BuyerPhysicalAddress);
              const dollarEth = priceFeed/1e8;
              const convertDollar  = (price/1e18)*dollarEth;
              setDollarPrice(convertDollar);
              const convertSellerCollateralDollar  = (sellerCollateral/1e18)*dollarEth;
              setSellerCollateralDollar(convertSellerCollateralDollar);
              if(buyerCollateral != 0) {
                const convertBuyerCollateralDollar  = (buyerCollateral/1e18)*dollarEth;
                setBuyerCollateralDollar(convertBuyerCollateralDollar);
              }
              if(tipForSeller != 0) {
                const convertTipForSellerDollar = (tipForSeller/1e18)*dollarEth;
                setTipForSellerDollar(convertSellerCollateralDollar);
              }
              if(tipForBuyer != 0) {
                const convertTipForBuyerDollar = (tipForBuyer/1e18)*dollarEth;
                setTipForBuyerDollar(convertTipForBuyerDollar);
              }
            }
            getData();
        }
      }
  }, [router.query.address, priceFeed]);

  const purchase = async (e) => {
    e.preventDefault();
    if (!account) return msgAlert("Please connect to MATIC...")
    if (!physicalAddress) {
      msgAlert("Please enter physical address")
      return
    } 
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(router.query.address, abi, signer)
      const tx = await contract.purchase(physicalAddress, { value: `${price * 2}`});
      await tx.wait(1);
    } catch(e) {
      console.log(e.message)
    }
    router.push(`/users/${account}`);
  }
  const msgAlert = (_msg) => {
    setWarningMsg(_msg)
    setTimeout(() => {
      setWarningMsg("")
    }, "3000")
  }
  const settle = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(router.query.address, abi, signer);
      const tx = await contract.buyerSettle();
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    router.push(`/users/${account}`);
  }
  const addTipForSeller =  async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(router.query.address, abi, signer);
      const tipForSellerInWei = Math.floor(tipForSellerInput*1e8*1e18/priceFeed)
      const tx = await contract.tipSeller({value: tipForSellerInWei.toString()});
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    window.location.reload(true);
  }

  const addTipForBuyer = async (e) => {
    e.preventDefault();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(router.query.address, abi, signer);
      const tipForBuyerInWei = Math.floor(tipForBuyerInput*1e8*1e18/priceFeed)
      const tx = await contract.tipBuyer({value: tipForBuyerInWei.toString()});
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    window.location.reload(true);
  }
  const refund = async (e) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(router.query.address, abi, signer);
      const tx = await contract.sellerRefund();
      await tx.wait(1);
    } catch(e) {
      console.log(e.message);
    }
    router.push(`/users/${account}`)
  }
  if(!price || !item || !ipfs || !sellerCollateral || !buyerCollateral || !tipForSeller || !tipForBuyer || !sellerAddress || !buyerAddress || !dollarPrice || !sellerCollateralDollar ) {
    return(
      <>
      <Header />
      <p
        className="text-center animate-pulse text-blue-500"
        >Loading Listing</p>
      </>
    )
  }
  if(finalSettlement === true) {
    return(
      <div>
        <Header />
        <div className="max-w-6xl mx-auto text-xl pt-10">
          <h1 className="text-xs px-2 text-center md:text-sm lg:text-lg text-gray-500">{router.query.address}: Contract Settled</h1>
        </div>
      </div>
      
    )
  }
  return (
    <div className="mb-10">
      <Header />
      <div className="max-w-6xl mx-auto px-5 text-xs md:text-lg">
      <p>{`Contract Address: ${router.query.address}`}</p>
      </div>
      
      <main className="max-w-6xl mx-auto justify-center w-full p-2 flex flex-col md:flex-row space-y-10 space-x-5">
        <div className="p-10 border flex mx-auto justify-center lg:mx-0 max-w-md lg:max-w-xl">
          <img src={ipfs} height={300} width={300} alt="item image"></img>
        </div>
        <section className='w-full'>
          <div className='flex flex-col lg:flex-row lg:justify-between'>
            <div className="mb-2">
              <h1 className="font-bold text-lg">{item}</h1>
              {buyerCollateral != 0 ? ("") : (
                <p className="text-gray-500">{`Price: ${Math.max( Math.round(dollarPrice * 100) / 100 ).toFixed(2)} USD`}</p>
              )}
              <p className="text-gray-500">{`Seller Collateral: ${Math.max( Math.round(sellerCollateralDollar * 100) / 100 ).toFixed(2)} USD`}</p>
              <p className="text-gray-500">{`Buyer Collateral: ${Math.max( Math.round(buyerCollateralDollar * 100) / 100 ).toFixed(2)} USD`}</p>
              <Link href={`/users/${sellerAddress}`}>
                <p className="text-blue-500 cursor-pointer underline">{`Seller Address: ${sellerAddress.slice(0,5) + "..." + sellerAddress.slice(-4)}`}</p>
              </Link>
              <Link href={`/users/${buyerAddress}`}>
              <p className="text-blue-500 cursor-pointer underline">{`Buyer Address: ${buyerAddress.slice(0,5) + "..." + buyerAddress.slice(-4)}`}</p>
              </Link>
              <p className="text-gray-500">{`Seller Physical Address: ${sellerPhysicalAddress}`}</p>
              <p className="text-gray-500">{`Buyer Physical Address: ${buyerPhysicalAddress}`}</p>
              {buyerCollateral != 0 ? (
                 <button onClick={refund} className="border-2 mt-2 mb-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Seller Cancel/Refunds</button>
              ) : ("")}
             
            </div>
            <div className="space-y-2 pr-5">
            <div className="flex justify-between pr-2 items-center space-x-3">
            <p className="text-gray-500">{`Tip for Seller: ${Math.max( Math.round(tipForSellerDollar * 100) / 100 ).toFixed(2)} USD`}</p>
            <form className="flex flex-col space-y-1">
              <input value={tipForSellerInput} onChange={e => setTipForSellerInput(e.target.value)} className="p-1 border" placeholder='enter tip seller USD' />
              <button onClick={addTipForSeller} className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Tip the Seller</button>
            </form>
            </div>
            <div className="flex justify-between pr-2 items-center space-x-3">
            <p className="text-gray-500">{`Tip for Buyer: ${Math.max( Math.round(tipForBuyerDollar * 100) / 100 ).toFixed(2)} USD`}</p>
            <form className="flex flex-col space-y-1">
            <input value={tipForBuyerInput} onChange={e => setTipForBuyerInput(e.target.value)} className="p-1 border" placeholder='enter tip buyer USD' />
            <button onClick={addTipForBuyer} type="submit" className="border-2 border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Tip the Buyer</button>
            </form>
            
            </div>
            </div>
          </div>
          {buyerCollateral != 0 ? (
            <div className="w-full pr-7">
                 <button onClick={settle} className="border-2 mt-2 w-full border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Buyer Settles</button>
            </div>
           
          ) : (
            <form className="flex flex-col pr-7">
            <input className="text-gray-500 p-1 my-2 border" value={physicalAddress} onChange={e => setPhysicalAddress(e.target.value)} placeholder="enter physical address" required />
            {/*  WARNING MESSAGE  */}
            <div className='flex mx-auto py-5 text-red-700'>
              {warningMsg}
            </div>
            <button onClick={purchase} type="submit" className="border-2 mt-2  border-blue-600 px-5 md:px-10 py-2 text-blue-600 hover:bg-blue-600/50 hover:text-white cursor-pointer">Purchase</button>
            </form>
           
          )}
          
        </section>
      </main>
      <br />
      <h3
      className="max-w-6xl mx-auto m-3 p-3 text-2xl"
      >Chat Box</h3>
      <ChatScreen contractAddress={router.query.address}/>
    </div>
  )
}