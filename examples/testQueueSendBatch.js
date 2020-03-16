
const Queue = require('../queue/queue');
const QueueMessage = require('../queue/message');
const Converter = require('../tools/stringToByte');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';
let queue = new Queue(kubeMQHost,kubeMQRestPort, clientID, queueName, undefined, 100, 1);

let messages = [];
for (let index = 0; index < 10; index++) {
   let msg = new QueueMessage(Converter.stringToByte('my buddy'));
 //  msg.addExpiration(1);
   messages.push(msg);   
};

queue.sendBatch(messages).then(res => {
   console.log(res);
   console.log("batch messages were sent")
})
.catch(err => {
   console.log(err)
});
