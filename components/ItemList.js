import React, { useEffect, useState } from 'react';
import Item from './Item';
import { UserContext } from '../context/AccountContext' // Mod1


const ItemList = ({ contractAddresses, isAccount, type, userAddress }) => {
  const { currentAccount, cautionMsg, redFlagMsg } = UserContext() // Mod2
  const [copyListArray, setCopyListArray] = useState([""]);

  useEffect(() => {
    if(contractAddresses) {
      setCopyListArray([...contractAddresses].reverse());
    }
  }, [contractAddresses])

  
  return (
    <div className="max-w-6xl mx-auto p-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        
      {copyListArray? (
        copyListArray.map((address) => (
          <div onClick={() => {!currentAccount? cautionMsg("Please connect to Matic"): ""}}> {/* Mod3 */}

            <Item key={`${address}-${isAccount}-${type}`} address={address} userAddress={userAddress} isAccount={isAccount} type={type} />
            <div className='text-red-500 mt-2'>{redFlagMsg}</div> {/* Mod4 */}
          
          </div>
          
        ))  
      ) : ("")}
      </div>
    </div>
  )
}

export default ItemList