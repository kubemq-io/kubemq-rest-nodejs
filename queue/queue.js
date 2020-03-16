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


const httpExec = require('../rest/httpExecuter');
const Transaction = require('../queue/transaction');

/**
 * Class representing a queue pattern on Rest. 
 */
class Queue {
    /**
    * @param {string} kubeMQHost - The KubeMQ address.
    * @param {number} kubeMQRestPort - The KubeMQ Rest exposed port.
    * @param {string} client - The publisher ID, for tracing.
    * @param {string} queueName - The queue name.
    * @param {string} group - Non mandatory group for round robin subscription.
    * @param {number} maxReceive - Default number of dequeue messages in request.
    * @param {number} waitTime - Default listening time in seconds for requests.
    * @param {boolean} isSecure - Using TLS secure KubeMQ.
    */
    constructor(kubeMQHost, kubeMQRestPort, client, queueName,  group, maxReceive = 32, waitTime = 1, isSecure) {
        if (kubeMQRestPort === undefined || kubeMQRestPort === null){
            throw new Error('Please fill kubeMQRestPort');
        }
        
        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort = isNaN(kubeMQRestPort) ? kubeMQPort.toString() : kubeMQRestPort;
        this.queueName = queueName;
        this.client = client;
        this.isSecure = isSecure;
        this.group = group;
        this.max_number_of_messages = maxReceive;
        this.wait_time_seconds_queue_messages = waitTime;

        this.options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json' }
        };
    }

    /**
     * send queue message using KubeMQ.
     * @param {Message} message        -     message to send to KubeMQ.
     */
    send(message) {

        message.Channel = this.queueName;
        message.ClientID = this.client;
        if (!message.MessageID) {
            message.MessageID = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5)
        }
        let options = this.options;
        options.method = 'POST';
        options.path = '/queue/send';

        if (this.isSecure) {
            return httpExec.getHttpsRequest(message, options);

        } else {

            return httpExec.getRequest(message, options);
        }

    };

    /**
    * send batch messages using KubeMQ.
    * @param {Message[]} messages        -     array of messages to send using KubeMQ.
    */
    sendBatch(messages) {
        let options = this.options;
        options.method = 'POST';
        options.path = '/queue/send_batch';

        messages.forEach(element => {
            //validation
            element.Channel = this.queueName;
            element.ClientID = this.client;

        });

        let request = {
            BatchID: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
            Messages: messages
        }

        if (this.isSecure) {
            return httpExec.getHttpsRequest(request, options);

        } else {

            return httpExec.getRequest(request, options);
        }
    }

    /**
     * receive Messages from KubeMQ
     * @param {number} maxReceive        -     number of messages to return from KubeMQ.
     * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
     */
    receive(max_number_of_messages, wait_time_seconds) {
        let options = this.options;
        options.method = 'POST';
        options.path = '/queue/receive';

        let request = {
            ClientID: this.client,
            Channel: this.queueName,
            MaxNumberOfMessages: max_number_of_messages === undefined ? this.max_number_of_messages : max_number_of_messages,
            IsPeak: false,
            WaitTimeSeconds: wait_time_seconds === undefined ? this.wait_time_seconds : wait_time_seconds,
        };

        if (this.isSecure) {
            return httpExec.getHttpsRequest(request, options);

        } else {

            return httpExec.getRequest(request, options);
        }
    }

    /**
    * Return the first X messages of the queue without dequeue.
    * @param {number} number_of_messages        -     number of messages to return from KubeMQ.
    * @param {number} wait_time_seconds         -     wait time (seconds) before receiving messages from queue.
    */
    peek(max_number_of_messages, wait_time_seconds) {
        let options = this.options;
        options.method = 'POST';
        options.path = '/queue/receive';

        let request = {
            ClientID: this.client,
            Channel: this.queueName,
            MaxNumberOfMessages: max_number_of_messages === undefined ? this.max_number_of_messages : max_number_of_messages,
            IsPeak: true,
            WaitTimeSeconds: wait_time_seconds === undefined ? this.wait_time_seconds : wait_time_seconds,


        };

        if (this.isSecure) {
            return httpExec.getHttpsRequest(request, options);

        } else {

            return httpExec.getRequest(request, options);
        }
    }

    /**
    * Purge all messages from queue.
    */
    ackAllMessages() {
        let options = this.options;
        options.method = 'POST';
        options.path = '/queue/ack_all';
        let request = {
            Channel: this.queueName,
            ClientId: this.client
        };
        if (this.isSecure) {
            return httpExec.getHttpsRequest(event, options);

        } else {

            return httpExec.getRequest(request, options);
        }

    }

    /**
    * send ping to KubeMQ to check connection
    */
    ping() {
        let options = this.options;
        options.method = 'GET';
        options.path = '/ping';

        if (this.isSecure) {
            return httpExec.getHttpsRequest(undefined, options);

        } else {

            return httpExec.getRequest(undefined, options);
        }
    }

    createTransaction() {
        if (!this.transaction) {
            this.transaction = new Transaction(this.kubeMQHost, this.kubeMQPort, this.client, this.queueName, this.isSecure);
        }
        return this.transaction;
    }
}

module.exports = Queue;

