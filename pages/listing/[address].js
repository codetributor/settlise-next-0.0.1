import { useRouter } from 'next/router';
import { ethers, BigNumber } from "ethers";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Link from 'next/link';
import ChatScreen from '@/components/ChatScreen';
import { UserContext } from '@/context/AccountContext';

export default function ListingPage() {

  const { currentAccount, getTxContract } = UserContext();

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
  
  useEffect(() => {
      if(router.query.address) {
        const txContract = getTxContract(router.query.address);
        
        if(txContract) {
          async function getData() {
              const Ipfs = await txContract.getIpfsImage();
              const Item = await txContract.getItem();
              const Price = await txContract.getPrice();
              const SellerCollateral = await txContract.getSellerCollateral();
              const BuyerCollateral = await txContract.getBuyerCollateral();
              const TipForSeller = await txContract.getTipForSeller();
              const TipForBuyer = await txContract.getTipForBuyer();
              const FinalSettlement = await txContract.getFinalSettlement();
              const SellerAddress = await txContract.getSellerAddress();
              const BuyerAddress = await txContract.getBuyerAddress();
              const SellerPhysicalAddress = await txContract.getSellerPhysicalAddress();
              const BuyerPhysicalAddress = await txContract.getBuyerPhysicalAddress();
              const ethPrice = await txContract.getLatestPrice()
              
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
    if (!currentAccount) return msgAlert("Please connect to MATIC...")
    if (!physicalAddress) {
      msgAlert("Please enter physical address")
      return
    } 
    try {
      const txContract = getTxContract(router.query.address);
      const tx = await txContract.purchase(physicalAddress, { value: `${price * 2}`});
      await tx.wait(1);
    } catch(e) {
      console.log(e.message)
    }
    router.push(`/users/${currentAccount}`);
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
      const txContract = getTxContract(router.query.address);
      const tx = await txContract.buyerSettle();
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    router.push(`/users/${currentAccount}`);
  }
  const addTipForSeller =  async (e) => {
    e.preventDefault();
    try {
      const txContract = getTxContract(router.query.address);
      const tipForSellerInWei = Math.floor(tipForSellerInput*1e8*1e18/priceFeed)
      const tx = await txContract.tipSeller({value: tipForSellerInWei.toString()});
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    window.location.reload(true);
  }

  const addTipForBuyer = async (e) => {
    e.preventDefault();
    try {
      const txContract = getTxContract(router.query.address);
      const tipForBuyerInWei = Math.floor(tipForBuyerInput*1e8*1e18/priceFeed)
      const tx = await txContract.tipBuyer({value: tipForBuyerInWei.toString()});
      await tx.wait(1)
    } catch(e) {
      console.log(e.message);
    }
    window.location.reload(true);
  }
  const refund = async (e) => {
    try {
      const txContract = getTxContract(router.query.address);
      const tx = await txContract.sellerRefund();
      await tx.wait(1);
    } catch(e) {
      console.log(e.message);
    }
    router.push(`/users/${currentAccount}`)
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