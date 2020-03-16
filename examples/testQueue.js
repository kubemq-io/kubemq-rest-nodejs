const Queue = require('../queue/queue');
const QueueMessage = require('../queue/message');
const Converter = require('../tools/stringToByte');


let message_queue = new Queue('localhost', '9090', 'client', 'testQueue', undefined, 10, 10000);

let messages = [
    new QueueMessage('meta', Converter.stringToByte('ms1')),
    new QueueMessage('meta2', Converter.stringToByte('body2'))
];

//1. purge the queue
message_queue.ackAllMessages().then(ackAllResponse => {
    console.log("called ack all")
    //2. send batch messages
    message_queue.sendBatch(messages).then(messageQueueResponse => {
        console.log(`finished sending batch ${messageQueueResponse.messagesRemaining} messages`);
        //3. receive messages
        message_queue.receive(10, 1).then(receivedMessages => {
            console.log(`received total of ${receivedMessages.MessagesReceived}, will peek to see queue status`);
            //4. peek queue status
            message_queue.peek(10, 1).then(peekResult => {
                console.log(`peek result returned :${peekResult} messages left`);
            })
        })
    })
}).catch(err => {
    console.log(err);
})
