/* MIT License

Copyright (c) 2018 KubeMQ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

const Queue = require('../queue/queue');
const byteToString = require('../tools/stringToByte').byteToString;

let kubeMQHost = 'localhost', kubeMQRestPort = '9090',
    queueName = 'hello-world-queue', clientID = 'test-queue-client-id2';

let queue = new Queue(kubeMQHost, kubeMQRestPort, clientID, queueName);

queue.receive(2, 1).then(res => {
    if (res.is_error) {
        console.log('Message enqueue error, error:' + res.message);
    } else {
        if (res.data.MessagesReceived) {
            console.log('Received: ' + res.data.MessagesReceived);
            res.data.Messages.forEach(element => {

                console.log('MessageID:' + element.MessageID + ', Body:' + byteToString(element.Body));
            });
        } else {
            console.log('No messages');
        }
    }
}).catch(
    err => console.log('Error:' + err));

