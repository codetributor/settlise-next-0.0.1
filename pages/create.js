import Header from '../components/Header'
import { ethers, BigNumber } from 'ethers'
import address from '../constants/address.json'
import abi from '../constants/abi.json'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'


const create = () => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState(0)
  const [sellerPhysicalAddress, setSellerPhysicalAddress] = useState("")
  const [ipfsImage, setIpfsImage] = useState("")  
  const { account } = useMoralis();
  const [warningMsg, setWarningMsg] = useState("")
  const [contract, setContract] = useState("")
  const [priceInWei, setPriceInWei] = useState(0)
  const [priceFeed, setPriceFeed] = useState(1)

  const handleCreateContract = async (e) => {
    e.preventDefault()

    if (!account) return msgAlert("Please connect to MATIC...")
    
    if (itemName.length == 0) return msgAlert("Please fill Item Name...")
    if (itemPrice.length == 0) return msgAlert("Please fill Item Price...")
    if (sellerPhysicalAddress.length == 0) return msgAlert("Please fill seller physical address...")
    if (ipfsImage.length == 0) return msgAlert("Please fill ipfs image...")

    const itemPriceInWei = Math.floor(itemPrice*1e8*1e18/priceFeed)
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address.address, abi.abi, provider.getSigner())
    contract.createTxContract(itemName, itemPriceInWei.toString(), sellerPhysicalAddress, ipfsImage, {value:itemPriceInWei.toString()})
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

  const updateEthers = () => {
    if (!account) return 
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempContract = new ethers.Contract(address.address, abi.abi, tempProvider.getSigner())
    setContract(tempContract)
  }

  const latestPrice = async() => {
    if (!contract) return
    const price = await contract.getLatestPrice()
    setPriceFeed(BigNumber.from(price["_hex"]).toString())
  }

  const convertToWei = () => {
    latestPrice()
    const scaleAmount = itemPrice * 1e8
    const amountInWei = Math.floor(1e18*scaleAmount/priceFeed);
    setPriceInWei(amountInWei)
    return amountInWei;
  }

  useEffect(() => {
    updateEthers()
  },[account])

  return(
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        
        <h1 className="text-4xl font-bold">List an Item</h1>
        <hr className="mb-5 mt-2" />
        <h2 className="text-xl font-semibold pt-5">Create your listing</h2>

        <form onSubmit={ (e) => handleCreateContract(e)}>
            <div className="flex flex-col p-10">
              <div className="grid grid-col-2 gap-5">

                {/*  ITEM NAME  */}
                <label className="font-light" htmlFor="">Item Name</label>
                <input onChange={e => {setItemName(e.target.value)}} type="text" value={itemName} placeholder='Laptop last...'  className="bg-gray-100 font-light p-3 outline-none" />
                
                {/*  ITEM PRICE  */}
                {priceFeed !== 1 && 
                <div>{`1 ETH = ${priceFeed/1e8} usd `}</div>
                }
                <div className='flex space-x-5 justify-between'>
                  <div className='flex flex-col w-[46%]'>
                    <label className="font-light" htmlFor="">Item price (usd)</label>
                    <input type="text" onChange={e => {(setItemPrice(e.target.value), convertToWei())}}  value={itemPrice} name='usd'
                    placeholder='1000' className="bg-gray-100 font-light p-3 outline-none"/>
                    
                  </div>
                  <div className='flex flex-col w-[46%]'>
                    <label className="font-light" htmlFor="">Item price (wei)</label>
                    <input type="text" onChange={e => setPriceInWei(e.target.value)} value={itemPrice*1e8*1e18/priceFeed || ""} name='usd'
                    placeholder='1000' className="bg-gray-100 font-light p-3 outline-none"/>
                  </div>                   
                </div>

                {/*  SELLER PHYSICAL ADDRESS  */}
                <label className="font-light" htmlFor="">Seller Physical Address</label>
                <input onChange={e => {setSellerPhysicalAddress(e.target.value)}} type="text" value={sellerPhysicalAddress} placeholder='2335 S State St Provo, UT 84606 ' className="bg-gray-100 font-light p-3 outline-none"/>
                
                {/*  IPFS IMAGE  */}
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

export default create