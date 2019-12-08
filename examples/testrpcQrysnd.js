
const QuerySender = require('../rpc/query/querySender');
const stringToByte = require('../tools/stringToByte').stringToByte;

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', channelName = 'qry';

let qrySend = new QuerySender(kubeMQHost, kubeMQRestPort, clientID, channelName, 10000);


let request = new QuerySender.QueryRequest(stringToByte('select books'));

qrySend.send(request).then(res => {
     console.log('Query response: '+JSON.stringify(res)) }
     ).catch(err=>{
          console.log('error query: '+err);
     });