const QueueTransaction = require('../queue/transaction');


let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

    let transactionQueue= new QueueTransaction(kubeMQHost, kubeMQRestPort, clientID, queueName);
 
transactionQueue.receiveMessage(5, 10);


transactionQueue.on('error', err => {
  if (err.IsError) {
    console.log('Error ' + err.Error);
  } else {
    console.log('Error ' + err.message);
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
  console.log("Need more time to process, extend visibility for more 3 seconds");
  extendVisibility().then(res=> {

  
  if (msg.Message.Attributes.Sequence !== 220) {
    transactionQueue.ackMessage();
  } else {
    transactionQueue.rejectedMessage();
  };
});
});

function extendVisibility(){
  transactionQueue.extendVisibility(3);
  return new Promise((resolve, reject) => {
    transactionQueue.addListener('extended', ack => {
      console.log(ack);
      resolve();
    });
  });
};


   
