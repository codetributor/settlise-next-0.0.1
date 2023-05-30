const { createContext, useState, useEffect, useContext } = require("react");
import { ethers } from 'ethers'
import abi from '../constants/abi.json'
import address from '../constants/address.json';
import txAbi from '../constants/txAbi.json';


const AccountContext = createContext()
export const UserContext = () => {
  return useContext(AccountContext)
}

export const AccountContextProvider = ({children}) => {

  const [currentAccount, setCurrentAccount] = useState()
  const [currentContract, setCurrentContract] = useState()
  const [redFlagMsg, setRedFlagMsg] = useState("")

  useEffect(() => {
    isWalletConnected()
  },[])

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
    
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", async () => {
      await isWalletConnected();   
    });
    
  }

  const getCurrentContract = () => {
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(address.address, abi.abi, signer)
    // setCurrentContract(contract)
    return contract
  }

  const getTxContract = (_address) => {
    if(!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const txContract = new ethers.Contract(_address, txAbi.txAbi, signer);
    return txContract
  }

  const cautionMsg = (_msg) => {
    setRedFlagMsg(_msg)
    setTimeout(() => {
      setRedFlagMsg("")
    }, "3000")
  }

  const data = {currentAccount, connectWallet, isWalletConnected, getCurrentContract, getTxContract, cautionMsg, redFlagMsg }

  return(
    <AccountContext.Provider value = {data}>
      {children}
    </AccountContext.Provider>
  )
}
