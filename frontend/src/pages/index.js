import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { Inter } from 'next/font/google'
import Web3Modal from "web3modal";
import { WHITELIST_CONTRACT_ADDRESS, abi } from '../constants';
import { Contract, providers } from 'ethers';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  // * walletConnected keep track of whether the user's wallet is connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // * number of whitelisted addreses
  const [numOfWhitelisted, setNumOfWhitelisted] = useState(0);
  // * joinedWhitelist keeps track of whether the current metamask address has joined the Whitelist or not
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // * loading state
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();


  /*
   ! Returns a Provider or Signer object representing the Ethereum RPC with or without the
   * signing capabilities of metamask attached
   *
   * A `Provider` is needed to interact with the blockchain - reading transactions, 
   * reading balances, reading state, etc.
   *
   * A `Signer` is a special type of Provider used in case a `write` transaction needs to be 
   * made to the blockchain, which involves the connected account needing to make a digital 
   * signature to authorize the transaction being sent. Metamask exposes a Signer API 
   * to allow your website to request signatures from the user using Signer functions.
   *
   * @param {*} needSigner - True if you need the signer, default false otherwise
   */
  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();
      // chainId for Goerli is 5.
      if (chainId !== 5) {
        window.alert("Change the network to the Goerli");
        throw new Error("Change the network to the Goerli")
      }
      // signer can write or interact with smart contract so if signer is true then return signer
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      // providers can only read from the contract.
      return web3Provider;
    } catch (error) {
      console.error(error);
    }
  }

  const checkIfAddressIsWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
      // get the address of the signer.
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (error) {
      console.error(error);
    }
  }


  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );

      const _numberOfWhitelisted =
        await whitelistContract.getNumAddressesWhitelisted();
      console.log(_numberOfWhitelisted);
      setNumOfWhitelisted(_numberOfWhitelisted); // set the state with the value returned from the contract
    } catch (error) {
      console.error(error);
    }
  }


  const connectWallet = async () => {
    try {
      // * Get the provider from web3Modal, which in our case is MetaMask
      // * When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressIsWhitelisted();
      getNumberOfWhitelisted();
    } catch (error) {
      console.error(error);
    }
  }

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );
       // * call the addAddressToWhitelist from the contract
      const tx = whitelistContract.addAddressToWhitelist();
      setLoading(true);
      // wait for the transaction to get mined
      await tx.wait();
      // console.log(tx);
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (error) {
      console.error(error);
    }
  }

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className=" leading-4 text-[1rem] mt-4 font-semibold text-[#0fc20f]">
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return (<button className="py-4 px-6 bg-[#0000ff] font-poppins font-semibold
        text-[18px] text-white outline-none rounded-lg mt-3">Loading...</button>);
      } else {
        return (
          <button onClick={addAddressToWhitelist} className="py-4 px-6 bg-[#0000ff] font-poppins font-semibold
          text-[18px] text-white outline-none rounded-lg mt-3">
            Join the Whitelist
          </button>
        );
      }
    }
    else {
      return (
        <button onClick={connectWallet} className="py-4 px-6 bg-[#0000ff] font-poppins font-semibold
        text-[18px] text-white outline-none rounded-lg mt-3">
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      // if wallet is not connected then connect it
      // * to connect wallet use web3Modal
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected])

  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <link rel="shortcut icon" href="./favicon.png" type="image/x-icon"></link>
        <meta name='description' http-equiv="X-UA-Compatible" content="Whitelist-DApp" />
      </Head>
      <div className="min-h-[90vh] flex md:flex-row  flex-col justify-center items-center font-poppins">
        <div className='flex flex-row'>
          <div className='flex flex-col justify-center'>
            <h1 className='my-[1rem] text-[#7e3afe] mx-[15px] text-[1.5rem] tracking-wider ml-20 font-sigmar font-semibold md:whitespace-nowrap'>Welcome to the Crypto Devs!!</h1>
            <div className='flex whitespace-nowrap text-[1rem] font-mono leading-3 justify-center'>
              {numOfWhitelisted} have already joined.
            </div>
            <div className='flex whitespace-nowrap text-[1rem] font-mono justify-center leading-[50px]'>
              {20 - numOfWhitelisted} slots left.
            </div>
            <div className='flex justify-center'>
              {renderButton()}
            </div>
          </div>

          <div className='w-[70%] h-[50%] md:ml-[15%] ml-auto'>
            <img src="./crypto-devs.svg" alt="Crypto-Devs" width={"100%"} className='md:mt-0 mt-10' />
          </div>
        </div>

      </div>
      <footer className='flex py-[2rem] border-t-[1px] border-solid border-[#eaeaea] justify-center items-center font-ubuntu font-semibold'>
        Made With 💙 by Hiren Timbadiya.
      </footer>
    </div>
  )
}
