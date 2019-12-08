const MessageQueue = require('../queue/queue');
const msgQueue = require('../queue/message');
const byteConverter = require('../tools/stringToByte').stringToByte;

let message_queue = new MessageQueue('localhost', '9090', 'client', 'testQueue', undefined, 10, 10000);

let messages = [
    new msgQueue('meta', byteConverter('ms1')),
    new msgQueue('meta2', byteConverter('body2'))
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
                console.log(`peek result returned :${peekResult.MessagesReceived} messages out of ${messagesRemaining} that was left`);
            })
        })
    })
}).catch(err => {
    console.log(err);
})
