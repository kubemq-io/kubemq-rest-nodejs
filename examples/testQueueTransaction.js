const QueueTransaction = require('../queue/transaction');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c2', queueName = 'testQueue';
let transactionQueue = new QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);

transactionQueue.receiveMessage(5, 10);


transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.Error);
  }
});

transactionQueue.on('end', mod => {
  console.log('end transaction by: ' + mod.by);
  //  transaction.receiveMessage(1, 10);
});
transactionQueue.addListener('extended', ack => {
  console.log(ack);
});

transactionQueue.on('message', msg => {
  console.log(msg);
  if (msg.IsError) {
    console.log('error' + msg);
    return;
  }
  // transaction.extendVisibility(40);
  if (workOnMSG(msg)) {
    transactionQueue.ackMessage();
  } else {
    transactionQueue.rejectedMessage();
  };
});




let counter = 1;
function workOnMSG(msg) {

  if (msg.Message.Attributes.Sequence !== 220) {
    console.log('worked on msg' + counter++);
    return true;
  }
  else {
    return false;
  }

};


