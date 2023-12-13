import "./app.css";
import { default as Web3} from 'web3';
var accounts;
var account;

var FoodTransportationContract;
var web3;


function addRow(tb,col1, col2, col3) {
    console.log(tb.FetchRowCount);
    var row = tb.insertRow(tb.FetchRowCount);
    row.insertCell(0).innerHTML = col1;
    row.insertCell(1).innerHTML = col2;
    row.insertCell(2).innerHTML = col3;
};

function resetTable(tb) {
    var rowNum=tb.rows.length;
    for (var i=1;i<rowNum;i++)
    {
        tb.deleteRow(i);
        rowNum=rowNum-1;
        i=i-1;
    }
};


function timestampToTime (timestamp){
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = (date.getMinutes()<10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = date.getSeconds()<10 ? '0'+date.getSeconds() : date.getSeconds();
    return Y+M+D+h+m+s;
};


window.App = {
    start: function() {
		var contractAddress = document.getElementById("contractAddress").value;
		if(contractAddress==""){
			document.getElementById("addNewLocation").disabled=true;
			document.getElementById("getCurrentLocation").disabled=true;
			} 
		else{
			document.getElementById("addNewLocation").disabled=false;
			document.getElementById("getCurrentLocation").disabled=false;
		} 
		
        var web3Provider;
        if (window.ethereum) {
            web3Provider = window.ethereum;
            try {
                // 请求用户授权
                window.ethereum.enable();
            } catch (error) {
                // 用户不授权时
                console.error("用户拒绝帐户授权")
            }
        } else if (window.web3) {   // 老版 MetaMask Legacy dapp browsers...
            web3Provider = window.web3.currentProvider;
        } else {
            web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(web3Provider);


        var self = this;
        web3.eth.getAccounts(function(err, accs) {
            if (err != null) {
                alert("获取您的账户时出错");
                return;
            }
            if (accs.length == 0) {
                alert("无法获取任何帐户！请确保以太坊客户端配置正确。");
                return;
            }

            console.log(accs);

            accounts = accs;
            account = accounts[0];
            web3.eth.defaultAccount= account;
            //FoodTransportationContract = web3.eth.contract([{"constant": false, "inputs": [{"internalType": "string", "name": "food", "type": "string"}, {"internalType": "string", "name": "locationName", "type": "string"}, {"internalType": "string", "name": "transPerson", "type": "string"}], "name": "addNewLocation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"}, {"constant": true, "inputs": [], "name": "getLocationNum", "outputs": [{"internalType": "uint8", "name": "", "type": "uint8"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [], "name": "getFoodName", "outputs": [{"internalType": "string", "name": "", "type": "string"}], "payable": false, "stateMutability": "view", "type": "function"}, {"constant": true, "inputs": [{"internalType": "uint8", "name": "locationNo", "type": "uint8"}], "name": "getLocation", "outputs": [{"internalType": "string", "name": "", "type": "string"}, {"internalType": "string", "name": "", "type": "string"}, {"internalType": "uint256", "name": "", "type": "uint256"}], "payable": false, "stateMutability": "view", "type": "function"}]);
			FoodTransportationContract = web3.eth.contract([{"inputs":[{"internalType":"string","name":"food","type":"string"},{"internalType":"string","name":"locationName","type":"string"},{"internalType":"string","name":"transPerson","type":"string"}],"name":"addNewLocation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getFoodName","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint8","name":"locationNo","type":"uint8"}],"name":"getLocation","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getLocationNum","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"}]);

		});
		//监听input值
		var address=document.getElementById("contractAddress")
		address.addEventListener('input',function(params){
			//console.log(this.value)
			if(this.value!=''){
				document.getElementById("addNewLocation").disabled=false;
				document.getElementById("getCurrentLocation").disabled=false;
				
			}
			else{
				document.getElementById("addNewLocation").disabled=true;
				document.getElementById("getCurrentLocation").disabled=true;
			}
		})
    },
    createContract: function()
    {
		
	
        var FoodTransportation = FoodTransportationContract.new(
            {
                from: web3.eth.accounts[0],
                data: '608060405234801561001057600080fd5b5061083d806100206000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c806305708e1c146100515780630b3de1b41461023a5780632efbd70d1461025b578063c0d25cf8146102de575b600080fd5b6102386004803603606081101561006757600080fd5b810190808035906020019064010000000081111561008457600080fd5b82018360208201111561009657600080fd5b803590602001918460018302840111640100000000831117156100b857600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561011b57600080fd5b82018360208201111561012d57600080fd5b8035906020019184600183028401116401000000008311171561014f57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f820116905080830192505050505050509192919290803590602001906401000000008111156101b257600080fd5b8201836020820111156101c457600080fd5b803590602001918460018302840111640100000000831117156101e657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506103fb565b005b6102426104fa565b604051808260ff16815260200191505060405180910390f35b610263610511565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102a3578082015181840152602081019050610288565b50505050905090810190601f1680156102d05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61030d600480360360208110156102f457600080fd5b81019080803560ff1690602001909291905050506105b3565b604051808060200180602001848152602001838103835286818151815260200191508051906020019080838360005b8381101561035757808201518184015260208101905061033c565b50505050905090810190601f1680156103845780820380516001836020036101000a031916815260200191505b50838103825285818151815260200191508051906020019080838360005b838110156103bd5780820151818401526020810190506103a2565b50505050905090810190601f1680156103ea5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b600080805460018160011615610100020316600290049050141561043157826000908051906020019061042f929190610749565b505b6104396107c9565b828160000181905250818160200181905250428160400181815250508060016000600260009054906101000a900460ff1660ff1681526020019081526020016000206000820151816000019080519060200190610497929190610749565b5060208201518160010190805190602001906104b4929190610749565b50604082015181600201559050506002600081819054906101000a900460ff168092919060010191906101000a81548160ff021916908360ff1602179055505050505050565b6000600260009054906101000a900460ff16905090565b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105a95780601f1061057e576101008083540402835291602001916105a9565b820191906000526020600020905b81548152906001019060200180831161058c57829003601f168201915b5050505050905090565b6060806000600160008560ff168152602001908152602001600020600001600160008660ff168152602001908152602001600020600101600160008760ff16815260200190815260200160002060020154828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106995780601f1061066e57610100808354040283529160200191610699565b820191906000526020600020905b81548152906001019060200180831161067c57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107355780601f1061070a57610100808354040283529160200191610735565b820191906000526020600020905b81548152906001019060200180831161071857829003601f168201915b505050505091509250925092509193909250565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061078a57805160ff19168380011785556107b8565b828001600101855582156107b8579182015b828111156107b757825182559160200191906001019061079c565b5b5090506107c591906107ea565b5090565b60405180606001604052806060815260200160608152602001600081525090565b5b808211156108035760008160009055506001016107eb565b509056fea2646970667358221220af6a7817c9401074d4d8a89bfaa489fa7cc2334d4e8f33dfd8b1e2c34809a09664736f6c634300060c0033',
                gas: '4700000'
            }, function (e, myContract){
                if (myContract.address) {
                    console.log('Contract mined! address: ' + myContract.address + ' transactionHash: ' + myContract.transactionHash);
                    document.getElementById("contractAddress").value = myContract.address;
					document.getElementById("addNewLocation").disabled=false;
					document.getElementById("getCurrentLocation").disabled=false;
                    document.getElementById("foodName").value = "";
                    var tbFoodName = document.getElementById("table_foodName");
                    tbFoodName.innerText = "";
                    var tb = document.getElementById("tb");
                    resetTable(tb);

                    // 合约发布成功后，才能调用后续的方法
                } else {
                    console.log("contract deploy transaction hash: " + myContract.transactionHash) //部署合约的交易哈希值
                }

            });
			
    },
    addNewLocation: function()
    {
        var contractAddress = document.getElementById("contractAddress").value;
		console.log("地址"+document.getElementById("contractAddress").value)

        try{
		var deployedFoodTransportation = FoodTransportationContract.at(contractAddress);
        var foodName = document.getElementById("foodName").value;
        var locationName = document.getElementById("locationName").value;
        var personName = document.getElementById("personName").value;

        deployedFoodTransportation.addNewLocation(foodName, locationName, personName, function(error){
            
			console.log(error);
			
        });
		
        document.getElementById("locationName").value = "";
        document.getElementById("personName").value = "";
		}catch(e){
			alert("食品信息地址不存在，请重新输入")
		}

    },
    getCurrentLocation: function()
    {
        var contractAddress = document.getElementById("contractAddress").value;
        var info = "";
		try{
        var deployedFoodTransportation = FoodTransportationContract.at(contractAddress);
        var food;
        deployedFoodTransportation.getFoodName.call(function (error,foodName) {
            food = foodName;
        })
        deployedFoodTransportation.getLocationNum.call(function (error, locationNum){
            var tbFoodName = document.getElementById("table_foodName");
            tbFoodName.innerText = "FoodName: "+food;
            var tb = document.getElementById("tb");
            resetTable(tb);
            while (locationNum >= 1){
                deployedFoodTransportation.getLocation.call(locationNum-1, function(error, returnValues){
                    addRow(tb,returnValues[0],returnValues[1],timestampToTime(returnValues[2]))
                })
                locationNum--;
            }
        })
		}catch(e){
			alert("食品信息地址不存在，请重新输入")
		}
    }
};

window.addEventListener('load', function() {
    if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("未检测到web3")
    }
    App.start();
});