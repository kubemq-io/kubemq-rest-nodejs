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

const rpc = require('../rpc');
const QueryRequest = require('../lowLevel/queryRequest');

//** Class representing a query request sender. */

class QuerySender {
    /**
    * 
    * @param {string} kubeMQHost - The KubeMQ address.
    * @param {number} kubeMQRestPort - The KubeMQ Grpc exposed port.
    * @param {string} client - The publisher ID, for tracking.
    * @param {string} channelName - The pub sub communication channel.
    * @param {number} defaultTimeout - The default response timeout.  
    * @param {boolean} isSecure - Using TLS secure KubeMQ.
    */
    constructor(kubeMQHost, kubeMQRestPort, client, channelName, defaultTimeout,isSecure) {
        this.rpc = new rpc(kubeMQHost, kubeMQRestPort, client, channelName, rpc.Type.Query, defaultTimeout,undefined, isSecure);
    }

    /**
    * publish Query.
    * @param {QueryRequest} request - The query request.
    */
    send(request) {

        return this.rpc.send(request);
    }
}

module.exports = QuerySender;
module.exports.QueryRequest = QueryRequest;
