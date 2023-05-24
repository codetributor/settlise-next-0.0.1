const { createContext, useState, useEffect, useContext } = require("react");
import { ethers } from 'ethers'
import abi from '../constants/abi.json'
import address from '../constants/address.json'


const AccountContext = createContext()
export const UserContext = () => {
  return useContext(AccountContext)
}

export const AccountContextProvider = ({children}) => {

  const [currentAccount, setCurrentAccount] = useState()
  const [currentContract, setCurrentContract] = useState()

  const connectWallet = async() => {
    if(!window.ethereum) return 
    const accounts = await window.ethereum.request({method:"eth_requestAccounts"})
    setCurrentAccount(accounts[0])
    // updateEthers()
  }

  const isWalletConnected = async () => {
    if(!window.ethereum) return
    const accounts = await window.ethereum.request({method: "eth_accounts"})
    setCurrentAccount(accounts[0])
    console.log("isWalletConnected: ",accounts[0])
    // updateEthers()
  }

  const getCurrentContract = () => {
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address.address, abi.abi, signer)
    // setCurrentContract(contract)
    return contract
  }

  useEffect(() => {
    isWalletConnected()
  },[])



  const data = {currentAccount, connectWallet, isWalletConnected, getCurrentContract }

  return(
    <AccountContext.Provider value = {data}>
      {children}
    </AccountContext.Provider>
  )
}
