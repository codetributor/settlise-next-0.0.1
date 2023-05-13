import Header from '../components/Header'
import { ethers } from 'ethers'
import address from '../constants/address.json'
import abi from '../constants/abi.json'
import { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'


const create = () => {
  const [itemName, setItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [sellerPhysicalAddress, setSellerPhysicalAddress] = useState("")
  const [ipfsImage, setIpfsImage] = useState("")  
  const { account } = useMoralis();
  const [warningMsg, setWarningMsg] = useState("")

  const handleCreateContract = async (e) => {
    e.preventDefault()

    if (!account) return msgAlert("Please connect to MATIC...")

    if (itemName.length == 0) return msgAlert("Please fill Item Name...")
    if (itemPrice.length == 0) return msgAlert("Please fill Item Price...")
    if (sellerPhysicalAddress.length == 0) return msgAlert("Please fill seller physical address...")
    if (ipfsImage.length == 0) return msgAlert("Please fill ipfs image...")
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(address.address, abi.abi, provider.getSigner())
    contract.createTxContract(itemName, Number(itemPrice), sellerPhysicalAddress, ipfsImage, {value:itemPrice})
    .then((res) => {
      setItemName("")
      setItemPrice("")
      sellerPhysicalAddress("")
      ipfsImage("")      
    })
    .catch(() => {
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

  return(
    <div>
      <Header />
      <main className="max-w-6xl mx-auto p-10 pt-2">
        
        <h1 className="text-4xl font-bold">List an Item</h1>
        {/* <h2 className="text-xl font-semibold pt-5">Select an Item you would like to sell</h2> */}
        <hr className="mb-5 mt-2" />
        <h2 className="text-xl font-semibold pt-5">Create your listing</h2>
        
        
        {/* <p>Bellow you will find the NFTs you own in your wallet</p> */}

        <form onSubmit={ (e) => handleCreateContract(e)}>
            <div className="flex flex-col p-10">
              <div className="grid grid-col-2 gap-5">

                <label className="font-light" htmlFor="">Item Name</label>
                <input onChange={e => {setItemName(e.target.value)}} type="text" value={itemName} placeholder='Laptop last...'  className="bg-gray-100 font-light p-3 outline-none" />

                <label className="font-light" htmlFor="">Item price</label>
                <input onChange={e => {setItemPrice(e.target.value)}} type="number" value={itemPrice} placeholder='1000' className="bg-gray-100 font-light p-3 outline-none"/>

                <label className="font-light" htmlFor="">Seller Physical Address</label>
                <input onChange={e => {setSellerPhysicalAddress(e.target.value)}} type="text" value={sellerPhysicalAddress} placeholder='2335 S State St Provo, UT 84606 ' className="bg-gray-100 font-light p-3 outline-none"/>
                
                <label className="font-light" htmlFor="">IPFS image</label>
                <input onChange={e => {setIpfsImage(e.target.value)}} type="text" value={ipfsImage} placeholder='https://...' className="bg-gray-100 font-light p-3 outline-none"/>

              </div>
              <div className='flex mx-auto py-5 text-red-700'>
                {warningMsg}
              </div>
              
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