import react from "react";
import reactdom from "react-dom/client";
import { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import Task from "./Task";
import "./App.css";
import { TaskContractAddress } from "./config.js";
import { ethers } from "ethers";
import TaskAbi from "./utils/TaskContract.json";

export default function App() {
  {
    /* This will store all the array of tasks */
  }
  const [tasks, setTasks] = useState([]);
  {
    /* This will store the task that is being added */
  }
  const [input, setInput]=useState('');
  {
    /* This will store the account address of metamask, since if there is no address we dont want the user to interact*/
  }
  const [currentAccount, setCurrentAccount] = useState("");
  {
    /* This will ensure the user uses the correct network, in our case goerli */
  }
  {
    /* useState false implies default value of boolean */
  }
  const [correctNetwork, setCorrectNetwork] = useState(false);

  // Get all task method

  const getAllTasks = async () => { 
    try {
      const {ethereum} = window
  
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )
  
        // allTasks is used to fetch all the tasks from the blockchain
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  // We use useEffect to get all tasks when the page loads
  useEffect(() => {
    getAllTasks();
  }, []);

  {
    /* This will ensure that the user is connected to metamask */
  }
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      }

      // get the account network id that user is connected to
      let chainId = await ethereum.request({ method: "eth_chainId" });

      const goerliChainId = "0x5";

      if (chainId !== goerliChainId) {
        alert('You are not connected to Goerli Test Network');
        return;
      } else {
        setCorrectNetwork(true);
      }
      // To get the account address from users metamask
      const accounts = await ethereum.request({ method: "eth_accounts" });
      // To connect to whatever is the first account we get from metamask
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // add task method
  const addTask = async (e) => {
    e.preventDefault();

    let task = {
      'taskText': input,
      'isDeleted' : false,
    };

    try {
      const {ethereum} = window;

      if(ethereum) {

        // To get the account address from users metamask and conncect to whatever is the first account we get from metamask
        const provider = new ethers.providers.Web3Provider(ethereum);
        // signer is used to sign the transaction and send it to the blockchain
        const signer  = provider.getSigner();
        // contract is used to interact with the smart contract with the help of the abi and the address of the contract
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        // This will add the task to the blockchain and .then is used to get the response from the blockchain
        TaskContract.addTask(task.taskText, task.isDeleted)
        .then(response => {
          setTasks([...tasks, task]);
        })
        .catch(err => {
          console.log(err);
        })
      }

    }catch(error) {

    }

    setInput('');
  };

  // Delete task method
  const deleteTask = key => async () => {

    try {
      const {ethereum} = window;

      if(ethereum) {

        // To get the account address from users metamask and conncect to whatever is the first account we get from metamask
        const provider = new ethers.providers.Web3Provider(ethereum);
        // signer is used to sign the transaction and send it to the blockchain
        const signer  = provider.getSigner();
        // contract is used to interact with the smart contract with the help of the abi and the address of the contract
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        )

        // deletTx is used to delete the task by making a transaction and setting it to true
        let deleteTx = await TaskContract.deleteTask(key,true);
        // This is to fetch all the tasks from the blockchain
        let allTasks = await TaskContract.getAllTasks();
        // This is to set the tasks to the state
        setTasks( allTasks );
      }

    }catch(error) {

    }

    setInput('');
  };

  return (
    <div>
      {/* If the current account is not connected to metamask, then we will show the connect wallet button
     else we will check the correct network and show the add task button */}
      {currentAccount === "" ? (
        <button
          className="text-2xl font-bold py-3 px-12 bg-[#f1c232] rounded-lg mb-10 hover:scale-105 transition duration-500 ease-in-out"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <div className="App">
          <h2> Task Management App</h2>
          <form>
            <TextField
              id="outlined-basic"
              label="Make Todo"
              variant="outlined"
              style={{ margin: "0px 5px" }}
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={addTask}>
              Add Task
            </Button>
          </form>
          <ul>
            {tasks.map((item) => (
              <Task
                key={item.id}
                taskText={item.taskText}
                onClick={deleteTask(item.id)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold text-2xl gap-y-3">
          <div>----------------------------------------</div>
          <div>Please connect to the Goerli Testnet</div>
          <div>and reload the page</div>
          <div>----------------------------------------</div>
        </div>
      )}
    </div>
  );
}
