
const Queue = require('../queue/queue');
let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';
const Converter = require('../tools/stringToByte');
let queue = new Queue(kubeMQHost, kubeMQRestPort, clientID, queueName);

queue.peek().then(receivedMessages => {
    if (receivedMessages.data.Messages) {
        receivedMessages.data.Messages.forEach(element => {
            console.log('peek message:' +  Converter.byteToString(element.Body));
        })
    };
});

