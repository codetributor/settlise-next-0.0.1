import Header from '../components/Header'
import { ethers, BigNumber } from 'ethers'
// import address from '../constants/address.json'
// import abi from '../constants/abi.json'
import { useEffect, useState } from 'react'
// import { useMoralis } from 'react-moralis'
import { UserContext } from '../context/AccountContext'


const Create = () => {
  const {currentAccount, connectWallet, isWalletConnected, getCurrentContract } = UserContext()  // ************

  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [sellerPhysicalAddress, setSellerPhysicalAddress] = useState("")
  const [ipfsImage, setIpfsImage] = useState("")  
  // const { account } = useMoralis();
  const [warningMsg, setWarningMsg] = useState("")
  // const [contract, setContract] = useState("")
  const [priceInWei, setPriceInWei] = useState(0)
  const [priceFeed, setPriceFeed] = useState(1)

  useEffect(() => {
    // updateEthers()
    // isWalletConnected()   // *************
  },[])

  // const handleCreateContract = async (e) => {
  //   e.preventDefault()

  //   if (!account) return msgAlert("Please connect to MATIC...")
    
  //   if (itemName.length == 0) return msgAlert("Please enter Item Name...")
  //   if (itemPrice.length == 0) return msgAlert("Please enter Item Price...")
  //   if (sellerPhysicalAddress.length == 0) return msgAlert("Please enter seller physical address...")
  //   if (ipfsImage.length == 0) return msgAlert("Please enter ipfs image...")

  //   const itemPriceInWei = Math.floor(itemPrice*1e8*1e18/priceFeed)
    
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const contract = new ethers.Contract(address.address, abi.abi, provider.getSigner())
  //   contract.createTxContract(itemName, itemPriceInWei.toString(), sellerPhysicalAddress, ipfsImage, {value:itemPriceInWei.toString()})
  //   .then((res) => {
  //     setItemName("")
  //     setItemPrice("")
  //     setsellerPhysicalAddress("")
  //     ipfsImage("")      
  //   })
  //   .catch((e) => {
  //     console.log(e.message);
  //     setItemName("")
  //     setItemPrice("")
  //     setSellerPhysicalAddress("")
  //     setIpfsImage("")
  //   })
  // }

  const handleCreateContract2 = async (e) => {
    e.preventDefault()

    if (!currentAccount) return msgAlert("Please connect to MATIC...")
    const currentContract = await getCurrentContract()

    if (itemName.length == 0) return msgAlert("Please enter Item Name...")
    if (itemPrice.length == 0) return msgAlert("Please enter Item Price...")
    if (sellerPhysicalAddress.length == 0) return msgAlert("Please enter seller physical address...")
    if (ipfsImage.length == 0) return msgAlert("Please enter ipfs image...")

    const itemPriceInWei = Math.floor(itemPrice*1e8*1e18/priceFeed)
    console.log("itemPriceInWei: ", itemPriceInWei)

    currentContract.createTxContract(itemName, itemPriceInWei.toString(), sellerPhysicalAddress, ipfsImage, {value:itemPriceInWei.toString()})
    .then((res) => {
      setItemName("")
      setItemPrice("")
      setsellerPhysicalAddress("")
      ipfsImage("")      
    })
    .catch((e) => {
      console.log(e.message);
      setItemName("")
      setItemPrice("")
      setSellerPhysicalAddress("")
      setIpfsImage("")
    })

  }

  const msgAlert = (_msg) => {
    setWarningMsg(_msg)
    setTimeout(() => {
      setWarningMsg("")
    }, "3000")
  }

  // const updateEthers = () => {
  //   if (!account) return 
  //   const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
  //   const tempContract = new ethers.Contract(address.address, abi.abi, tempProvider.getSigner())
  //   setContract(tempContract)
  // }

  // const latestPrice = async() => {
  //   if (!contract) return
  //   const price = await contract.getLatestPrice()
  //   setPriceFeed(BigNumber.from(price["_hex"]).toString())
  // }

  const latestPrice2 = async () => {
    const currentContract = await getCurrentContract()
    const price = await currentContract.getLatestPrice()
    setPriceFeed(BigNumber.from(price["_hex"]).toString())
  }

  // const convertToWei = () => {
  //   latestPrice()
  //   const scaleAmount = itemPrice * 1e8
  //   const amountInWei = Math.floor(1e18*scaleAmount/priceFeed);
  //   setPriceInWei(amountInWei)
  //   return amountInWei;
  // }

  const convertToWei2 = () => {
    latestPrice2()
    const scaleAmount = itemPrice * 1e8
    const amountInWei = Math.floor(1e18*scaleAmount/priceFeed);
    setPriceInWei(amountInWei)
    return amountInWei;
  }



  

  return(
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        
        <h1 className="text-4xl font-bold">List an Item</h1>
        <hr className="mb-5 mt-2" />
        <h2 className="text-xl font-semibold pt-5">Create your listing</h2>

        <form onSubmit={ (e) => handleCreateContract2(e)}>
            <div className="flex flex-col p-0 md:p-10">
              <div className="grid grid-col-2 gap-5">
              
                {/*  ITEM NAME  */}
                <label className="font-light" htmlFor="">Item Name</label>
                <input onChange={e => {setItemName(e.target.value)}} type="text" value={itemName} placeholder='Laptop last...'  className="bg-gray-100 font-light p-3 outline-none" />
                
                {/*  ITEM PRICE  */}
                {priceFeed !== 1 && 
                <div>{`1 ETH = ${priceFeed/1e8} usd `}</div>
                }
                <div className='flex flex-col md:flex-row md:space-x-5 justify-between'>
                  <div className='flex flex-col w-[100%] md:w-[46%]'>
                    <label className="font-light" htmlFor="">Item price (usd)</label>
                    <input type="text" onChange={e => {(setItemPrice(e.target.value), convertToWei2())}}  value={itemPrice} name='usd'
                    placeholder='1000' className="bg-gray-100 font-light p-3 outline-none"/>
                    
                  </div>

                  <div className='flex flex-col w-[100%] md:w-[46%] pt-5 md:py-0'>
                    <label className="font-light" htmlFor="">Item price (wei)</label>
                    <input type="text" onChange={e => setPriceInWei(e.target.value)} value={itemPrice*1e8*1e18/priceFeed || ""} name='usd'
                    placeholder='1000' className="bg-gray-100 font-light p-3 outline-none"/>
                  </div>                   
                </div>

                {/*  SELLER PHYSICAL ADDRESS  */}
                <label className="font-light" htmlFor="">Seller Physical Address</label>
                <input onChange={e => {setSellerPhysicalAddress(e.target.value)}} type="text" value={sellerPhysicalAddress} placeholder='2335 S State St Provo, UT 84606 ' className="bg-gray-100 font-light p-3 outline-none"/>
                
                {/*  URL IMAGE  */}
                <label className="font-light" htmlFor="">Hosted Image Url</label>
                <input onChange={e => {setIpfsImage(e.target.value)}} type="text" value={ipfsImage} placeholder='https://...' className="bg-gray-100 font-light p-3 outline-none"/>

              </div>

              {/*  WARNING MESSAGE  */}
              <div className='flex mx-auto py-5 text-red-700'>
                {warningMsg}
              </div>
              
              {/*  BUTTON CREATE LISTING  */}
              <button type="submit" className="bg-blue-600 text-white rounded-lg p-6 mt-5 font-semibold text-xl 
              hover:bg-transparent hover:text-blue-600 hover:border-2 hover:border-blue-600">
                Create Listing
              </button>

            </div>
          </form>

      </main>
    </div>
  )
}

export default Create