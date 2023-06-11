import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import axios from "axios";
import { useState } from "react";
import Web3 from "web3";
import MarketplaceJSON from "../abis/NFTMarketplace.json";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Marketplace() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs() {
    const ethers = require("ethers");

    const provider = await detectEthereumProvider();
    window.web3 = new Web3(provider);
    const web3 = window.web3;
    const networkId = await web3.eth.net.getId();
    const networkData = MarketplaceJSON.networks[networkId];
    const abi = MarketplaceJSON.abi;
    const address = networkData.address;

    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const prv = new ethers.providers.Web3Provider(window.ethereum);
    const signer = prv.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(address, abi, signer);

    //create an NFT Token
    let transaction = await contract.getAllNFTs();
    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    updateFetched(true);
    updateData(items);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar></Navbar>
      <div className='flex flex-col place-items-center mt-20'>
        <div className='md:text-xl font-bold text-white'>Top NFTs</div>
        <div className='flex mt-5 justify-between flex-wrap max-w-screen-xl text-center'>
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
      </div>
    </div>
  );
}
