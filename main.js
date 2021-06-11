const fetch = require('node-fetch');
const etherscanAPI = 'YOURAPIHERE';

// AAVE Lending Pool Core V1
// 0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3

// List of all transactions involving interaction with AAVE loans (flash or otherwise)
// https://api.etherscan.io/api?module=account&action=txlistinternal&address=0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3&startblock=0&endblock=200&sort=asc&apikey=${etherscanAPI}
// https://api.etherscan.io/api?module=account&action=txlistinternal&address=0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3&page=1&offset=10&sort=desc&apikey=${etherscanAPI}

// Example of transaction interacting with AAVE Lending Pool Core V1
// https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=0x6a86790f833d96f24bda24b45b7cd0753e847ddeb1d3368ab9d2c21a4b2b9643&apikey=${etherscanAPI}
const aave = '0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3'.toLowerCase();

(async () => {
  const getAAVETrans = await fetch(
    `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${aave}&page=1&offset=100&sort=desc&apikey=${etherscanAPI}`,
    {
      method: 'GET',
    },
  );
  const output = await getAAVETrans.json();
  // console.log(output);
  let isFlashLoan = 0;
  let notFlashLoan = 0;
  for(let n = 0; n < output.result.length; n++){
    // console.log(output.result[n]);
    const address = output.result[n].hash;
    const transactions = await fetch(
      `https://api.etherscan.io/api?module=account&action=txlistinternal&txhash=${address}&apikey=${etherscanAPI}`,
      {
        method: 'GET',
      },  
    );
    const trans = await transactions.json();
    console.log(trans);
    let fromTx = false;
    let toTx = false;
    let transAssoc = '';
    trans.result.forEach(
      t => {
        transAssoc += `${t.from} => ${t.to}\n`;
        if(t.from.toLowerCase() == aave){
          fromTx = true;
        }
        if(t.to.toLowerCase() == aave){
          toTx = true;
        }
      }
    );
    if(fromTx && toTx){
      console.log(`Transaction ${address} is flash loan (repaid)`);
      console.log(transAssoc);
      isFlashLoan ++;
    } else {
      notFlashLoan ++;
    }
    // console.log(trans);
  }
  console.log(`${100*isFlashLoan / (isFlashLoan+notFlashLoan)} % of transactions contain flash loans`);
})();
