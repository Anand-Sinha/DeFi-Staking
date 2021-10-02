pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank{
    address public owner;
    string public name = 'Decentral Bank';
    Tether public tether;
    RWD public rwd;
    
    address [] public stakers;

    mapping(address=>uint) public stakingBalance;
    mapping(address=>bool) public hasStaked;
    mapping(address=>bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public{
        owner = msg.sender;
        rwd = _rwd;
        tether = _tether; 
    }

    // Staking function
    function depositTokens(uint _amount) public {
        require(_amount>0, 'amount cant be less than 0');
        tether.transferFrom(msg.sender, address(this), _amount);
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
            stakingBalance[msg.sender] = 0;
        }
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    function unstakeTokens() public{
        uint balance = stakingBalance[msg.sender];
        require(balance>0);
        tether.transfer(msg.sender, balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender]=false;
    }
    function issueTokens() public {
        require(msg.sender == owner);
        for (uint i=0; i<stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient]/9;
            if(balance>0){
                rwd.transfer(recipient, balance);
            }
        }
    }
    
}
