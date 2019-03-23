/**
 * @desc: { 部署合约，最后输出合约地址在根目录，以 ${contactName}Address.json 命名 } 
 * @author: zhengyiqiu 
 * @Create Date: 2019-03-23 20:05:44 
 * @Last Modified by: zhengyiqiu
 * @Last Modified time: 2019-03-23 20:06:31
 */
const fs = require('fs-extra');
const path = require('path');
const config = require('config');
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');

// 部署函数
function deploy(contractPathArr, contractNameArr) {
  contractPathArr.forEach((contractPath, i) => {
    let contractName = contractNameArr[i]
    // 1. 拿到 bytecode
    const { interface, bytecode } = require(contractPath);
    
    // 2. 配置 provider
    const provider = new HDWalletProvider(
        config.get('hdwallet'),
        config.get('infuraUrl'),
    );
    
    // 3. 初始化 web3 实例
    const web3 = new Web3(provider);
    
    (async () => {
        // 4. 获取钱包里面的账户
        const accounts = await web3.eth.getAccounts();
        console.log(`${contractName}合约部署账户:`, accounts[0]);
    
        // 5. 创建合约实例并且部署
        console.time(`${contractName}合约部署耗时`);
        const result = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({ data: bytecode })
            .send({ from: accounts[0], gas: '5000000' });
        console.timeEnd(`${contractName}合约部署耗时`);
    
        const contractAddress = result.options.address;
    
        console.log(`${contractName}合约部署成功:`, contractAddress);
        // console.log('合约查看地址:', `https://rinkeby.etherscan.io/address/${contractAddress}`);
        console.log(`${contractName}合约查看地址:`, `https://ropsten.etherscan.io/address/${contractAddress}`);
    
        // 6. 合约地址写入文件系统
        const addressFile = path.resolve(__dirname, `../${contractName}Address.json`);
        fs.writeFileSync(addressFile, JSON.stringify(contractAddress));
        console.log(`${contractName}地址写入成功:`, addressFile);
        process.exit();
    })();
  })

}

// const projectListContractPath = path.resolve(__dirname, '../compiled/ProjectList.json');
// const LedContractPath = path.resolve(__dirname, '../compiled/Led.json');
const LogsContractPath = path.resolve(__dirname, '../compiled/Logs.json');
deploy([LogsContractPath], ['logs']);
