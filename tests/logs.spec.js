const assert = require('assert');
const path = require('path');
const ganache = require('ganache-cli');
const BigNumber = require('bignumber.js');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());
const Logs = require(path.resolve(__dirname, '../compiled/Logs.json'));
const Log = require(path.resolve(__dirname, '../compiled/Log.json'));

let accounts;
let logs;
let log;

describe('Log Contract', () => {
    // 1. 每次跑单测时需要部署全新的合约实例，起到隔离的作用
    beforeEach(async () => {
        // 1.1 拿到 ganache 本地测试网络的账号
        accounts = await web3.eth.getAccounts();

        // 1.2 部署 Logs 合约
        logs = await new web3.eth.Contract(JSON.parse(Logs.interface))
            .deploy({ data: Logs.bytecode })
            .send({ from: accounts[0], gas: '5000000' });

        // 1.3 调用 Logs 的 createProject 方法
        await logs.methods.createProject('Ethereum DApp Tutorial', 100, 10000, 1000000).send({
            from: accounts[0],
            gas: '5000000',
        });

        // 1.4 获取刚创建的 Log 实例的地址
        const [address] = await logs.methods.getProjects().call();

        // 1.5 生成可用的 Log 合约对象
        log = await new web3.eth.Contract(JSON.parse(Log.interface), address);
    });

    it('should deploy Logs and Log', async () => {
        assert.ok(logs.options.address);
        assert.ok(log.options.address);
    });

    it('should save correct log properties', async () => {
        const owner = await log.methods.owner().call();
        const description = await log.methods.description().call();
        const minInvest = await log.methods.minInvest().call();
        const maxInvest = await log.methods.maxInvest().call();
        const goal = await log.methods.goal().call();

        assert.equal(owner, accounts[0]);
        assert.equal(description, 'Ethereum DApp Tutorial');
        assert.equal(minInvest, 100);
        assert.equal(maxInvest, 10000);
        assert.equal(goal, 1000000);
    });

    it('should allow investor to contribute', async () => {
        const investor = accounts[1];
        await log.methods.contribute().send({
            from: investor,
            value: '200',
        });

        const amount = await log.methods.investors(investor).call();
        assert.ok(amount == '200');
    });

    it('should require minInvest', async () => {
        try {
            const investor = accounts[1];
            await log.methods.contribute().send({
                from: investor,
                value: '10',
            });
            assert.ok(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should require maxInvest', async () => {
        try {
            const investor = accounts[1];
            await log.methods.contribute().send({
                from: investor,
                value: '100000',
            });
            assert.ok(false);
        } catch (err) {
            assert.ok(err);
        }
    });

    it('should allow owner to create payment', async () => {
        const owner = accounts[0];
        const receiver = accounts[2];

        await log.methods.createPayment('Rent Office', '500', receiver).send({
            from: owner,
            gas: '1000000',
        });

        const payment = await log.methods.payments(0).call();
        assert.equal(payment.description, 'Rent Office');
        assert.equal(payment.amount, '500');
        assert.equal(payment.receiver, receiver);
        assert.equal(payment.completed, false);
        assert.equal(payment.voterCount, 0);
    });

    it('allows investor to approve payments', async () => {
        // 项目方、投资人、收款方账户
        const owner = accounts[0];
        const investor = accounts[1];
        const receiver = accounts[2];

        // 收款前的余额
        const oldBalance = new BigNumber(await web3.eth.getBalance(receiver));

        // 投资项目
        await log.methods.contribute().send({
            from: investor,
            value: '5000',
        });

        // 资金支出请求
        await log.methods.createPayment('Rent Office', 2000, receiver).send({
            from: owner,
            gas: '1000000',
        });

        // 投票
        await log.methods.approvePayment(0).send({
            from: investor,
            gas: '1000000',
        });

        // 资金划转
        await log.methods.doPayment(0).send({
            from: owner,
            gas: '1000000',
        });

        // 检查 payment 状态
        const payment = await log.methods.payments(0).call();
        assert.equal(payment.completed, true);
        assert.equal(payment.voterCount, 1);

        // 收款后的余额
        const newBalance = new BigNumber(await web3.eth.getBalance(receiver));
        const balanceDiff = newBalance.minus(oldBalance);
        console.log({ oldBalance, newBalance, balanceDiff });

        // 确保精确的余额变化
        assert.equal(balanceDiff, 2000);
    });
});
