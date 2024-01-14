import React, { useState, useffect } from "react";

import Web3Modal from "web3modal";

import { ethers } from
"ethers";



//INTERNAL IMPORT

import tracking from "…ABI that will come in build info folder";

const ContractAddress = "..address";

const ContractABI = tracking.abi;

//---FETCHING SMART CONTRACT
const fetchContract = (signerOrProvider) =>
new ethers.Contract(ContractAddress, ContractABI, signerOrProvider);
export const TrackingContext = React.createContext();
export const TrackingProvider = ({ children }) => {
    //STATE VARIABLE
    const DappName = "Product Tracking Dapp";
    const [currentUser, setCurrentUser] = useState("");
    const createShipment = async (items) => {
        console.log (items);
        const { receiver, pickupTime, distance, price} = items;
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const createItem = await contract.createShipment(
                receiver,
                new Date(pickUpTime).getTime(),
                distance,
                ethers.utils.parseUnits(price, 18),
                {
                    value: ethers.utils.parseUnits(price, 18),
                }
            );
            await createItem.wait();
            console.log(createItem);

        } catch (error) {
            console.log("Something went wrong", error);
        }
    };

    const getAllShipment = async () => {
        try {
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipments = await contract.getAllTransactions();
            const allShipment = shipments.map((shipment) => ({
                sender: shipment.sender,
                receiver: shipment.receiver,
                price: ethers.utils.formatEthers(shipment.price.toString()),
                pickUpTime: shipment.pickUpTime.toNumber(),
                deliveryTime: shipment.deliveryTime.toNumber(),
                distance: shipment.distance.toNumber(),
                isPaid: shipment.isPaid,
                status: shipment.status,                
            }) )
            return allShipments;
        } catch (error) {
            console.log("Error while getting shipment");
        }
    };
    const getShipmentsCount = async () => {
        try {
            if (!window.ethereum) return "Install MetaMask" ;
            const accounts = await window.ethereun.request({
                method: "eth_accounts",

            });
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipmentsCount = await contract.getShipmentsCount(account[0]);
            return shipmentsCount.toNumber();
        } catch (error) {
            console.log("Error while getting shipment");
        }
    };

    const completeShimpent = async(completeShip) => {
        console.log(completeShip);
        const {receiver, index} = completeShip;
        try{
            if (!window.ethereum) return "Install MetaMask" ;
            const accounts = await window.ethereun.request({
                method: "eth_accounts",

            });
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer);
            const transaction = await contract.completeShipment(
                account[0],
                receiver,
                index,
                {
                    gasLimit: 300000,
                }
            );
            transaction.wait();
            console.log(transaction);

        } catch (error) {
            console.log("something went wrong", error);
        }
    };

    const getShipment = async (index)=>{
        console.log(index*1);
        try {
            if (!windows.ethereum) return "Install MetaMask";
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            const providers= new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipment = await contract.getShipment(account[0], index*1);
            const SingleShipment = {
                sender: shipment[0],
                receiver: shipment[1],
                pickupTime: shipment[2].toNumber(),
                deliveryTime: shipment[3].toNumber(),
                distance: shipment[4].toNumber(),
                price: ethers.utils.formatEther(shipment[5],toString()),
                status: shipment[6],
                isPaid: shipment[7],
            };
            return SingleShipment;
        } catch (error){
            console.log("sorry no shipment");
        }
    };

    const startShipment = async (getProduct) => {
        const{ receiver,index}=getProduct;

        try{
            if(!window.ethereum) return "Install MetaMask";

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            });

            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer  = provider.getSigner();
            const contract = fetchContract(signer);
            const shipment = await contract.startShipment(
                accounts[0],
                receiver,
                index * 1
            );

            shipment.wait();
            console.log(shipment);
        } catch (error){
            console.log("sorry no shipment",error)
        }
    };
    //---check wallet connection
    const checkIfWalletConnected = async () => {
        try{
            if (!window.ethereum) return "install metamask";

            const accounts = await window.ethereum.request({
                method: "eth_amounts",
            });

            if (accounts.length){
                setCurrentUser(accounts[0]);
            } else {
                return "no account found";
            }
        }   catch (error) {
            return "Not connected";
        }
    };

    //---connect wallet function
    const connectWallet= async () => {
        try {
            if (!window.ethereum) return "install metamask";

            const accounts = await window.ethereum.request({
                method: "eth_amounts",
            });

            setCurrentUser(accounts[0]);
        } catch (error){
            return "something went wrong";
        }
    };

    useEffect(()=> {checkIfWalletConnected();
    }, []);

    return (
        <TrackingContext.Provider value ={{
            connectWallet,
            createShipment,
            getAllShipment,
            completeShimpent,
            getShipment,
            startShipment,
            getShipmentsCount,
            DappName,
            currentUser,
        }}>{children}</TrackingContext.Provider>
    );
};