const MessageQueue = require('../queue/queue');

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    clientID = 'c1', queueName = 'testQueue';

let queue = new MessageQueue(kubeMQHost, kubeMQRestPort, clientID, queueName);

queue.peek().then(receivedMessages => {
    if (receivedMessages.data.Messages) {
        receivedMessages.data.Messages.forEach(element => {
            console.log('peek message:' + element);
        })
    };
});

