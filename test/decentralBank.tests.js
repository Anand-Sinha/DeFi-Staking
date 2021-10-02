const Tether = artifacts.require('./src/contracts/Tether');
const RWD = artifacts.require('./src/contracts/RWD');
const DecentralBank = artifacts.require('./src/contracts/DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', (accounts) => {
    let tether, rwd, decentralBank
    
    function tokens(number) {
        return web3.utils.toWei(number, 'ether')
    }

    before(async () => {
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address, tether.address)
        await rwd.transfer(decentralBank.address, tokens('1000000'))
        await tether.transfer(accounts[1], tokens('100'), {from: accounts[0]})
    })

    describe('Mock Tether Deployment', async () =>{
        it('matched name successfully', async () =>{
            const name = await tether.name()
            assert.equal(name, 'Tether')
        })
    })
    describe('RWD Symbol Deployment', async () =>{
        it('matched symbol successfully', async () =>{
            const symbol = await rwd.symbol()
            assert.equal(symbol, 'RWD')
        })
    })
    describe('Decentral Bank Deployment', async () =>{
        it('matched symbol successfully', async () =>{
            const name = await decentralBank.name()
            assert.equal(name, 'Decentral Bank')
        })
        it('contract has tokens', async () =>{
            let balance = await rwd.balanceOf(decentralBank.address) // better understanding
            assert.equal(balance, tokens('1000000'))
        })
    })
    describe('Yield Farming', async () =>{
        it('rewards tokens for staking', async () =>{
            let result
            result = await tether.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
            await tether.approve(decentralBank.address, tokens('100'), {from: accounts[1]})
            await decentralBank.depositTokens(tokens('100'), {from:accounts[1]})
            result = await tether.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking')
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'bank mock wallet balance after staking')
        })
    })
    describe('Staking Status', async () =>{
        it('tokens staked', async () =>{
            let result
            result = await decentralBank.isStaking(accounts[1])
            assert.equal(result.toString(), 'true', 'Customer is staking coins')
        })
    })
    describe('Staking Reward', async()=>{
        it('rewards recieved', async()=>{
            await decentralBank.issueTokens({from: accounts[0]})
        })
    })
    // describe('Unstaking Test', async()=>{
    //     it('unstaking coins', async()=>{
    //         await decentralBank.unstakeTokens({from: accounts[1]})
    //         let result
    //         result = await tether.balanceOf(accounts[1])
    //         assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')
    //         result = await tether.balanceOf(decentralBank.address)
    //         assert.equal(result.toString(), tokens('0'), 'bank mock wallet balance after unstaking')
    //         result = await decentralBank.isStaking(accounts[1])
    //         assert.equal(result.toString(), 'false', 'Customer is unstaking coins')
    //     })
    // })
})