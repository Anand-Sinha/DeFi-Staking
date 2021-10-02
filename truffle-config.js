require('babel-register')
require('babel-polyfill')
var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'mixture siege crew plastic rude island crumble cat ensure meadow twin easy'
module.exports = {
    networks:{
        development:{
            host: '127.0.0.1:',
            port: '7545',
            network_id: '*' // Connect to any network
        },
        ropsten: {
            provider: function() {
              return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/ebb2daf182ec4358ae49e90d67aeca19")
            },
            network_id: 3,
            gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
        }
    },
    contracts_directory: './src/contracts',
    contracts_build_directory: './src/truffle_abis',
    compilers:{
        solc:{
            version: '^0.5.0',
            optimizer:{
                enabled: true,
                runs: 200
            },
        }
    }
}