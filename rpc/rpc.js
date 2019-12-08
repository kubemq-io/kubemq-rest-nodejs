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

const stream = require('../rest/stream');
const httpExec = require('../rest/httpExecuter');
let ws;
let options;

class rpc {
/**
* @param {string} kubeMQHost - The KubeMQ address.
* @param {number} kubeMQRestPort - The KubeMQ Rest exposed port.
* @param {string} client - The publisher ID, for tracing.
* @param {string} channelName - The pub sub communication channel.    
* @param {number} type -  Command: 1,  Query: 2
* @param {number} defaultTimeout - The default response timeout. 
* @param {string} group - Non mandatory group for round robin subscription.
* @param {boolean} isSecure - Using TLS secure KubeMQ.
*/
constructor(kubeMQHost, kubeMQRestPort, client, channelName, type, defaultTimeout, group, isSecure) {

        this.kubeMQHost = kubeMQHost;
        this.kubeMQPort = isNaN(kubeMQRestPort)? kubeMQPort.toString() : kubeMQRestPort ;
        this.channelName = channelName;
        this.defaultTimeout = defaultTimeout;
        this.client = client;
        this.type = type;    
        this.isSecure = isSecure;
        this.group = group;
      
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            "headers": { 'Content-Type': 'application/json' }
        };
    }

/**
 * Send a request CommandRequest/QueryRequest.
 * @param {CommandRequest/QueryRequest} request - The request object.
 */
    send(request) {
        request.Channel = this.channelName;
        request.ClientId = this.client;       

        request.RequestTypeData = this.type;
       
        if (request.Timeout === undefined) {
            request.Timeout = this.defaultTimeout;
        }

        options.method = 'POST';

        options.path = '/send/request';
      

        if (this.isSecure) {
            return httpExec.getHttpsRequest(request, options);

        } else {

            return httpExec.getRequest(request, options);
        }

    }

    /**
     * Callback for incoming Query.
     *
     * @callback req_handler
     * @param {string} msg - receive data.
     */

    /**
     * Subscribe to streaming responses.
     * @param {req_handler} responder * @param Callback for incoming query.
     */
    subscribe(responder, errorHandler) {
        let options = {          
            rejectUnauthorized: false
        };
        let url = this.isSecure ? 'wss://' : 'ws://';
        url = url.concat(this.kubeMQHost+':'+this.kubeMQPort);
        url = url.concat('/subscribe/requests');
        url = url.concat('?client_id=' + this.client);
        url = url.concat('&channel=' + this.channelName);

        if (this.group){
        url = url.concat('&group=' + this.group);
        }

        if (this.type === 1){
        url = url.concat('&subscribe_type='+'commands')
        } else {
            url = url.concat('&subscribe_type='+'queries')
        }

         ws = new stream(url, options);
        ws.openStream();
        ws.on('message', function incoming(data) {
            responder(JSON.parse(data));
        });
        return new Promise((resolve, reject) => {
            ws.on('open', function open() {
                console.log('responder open');
                return resolve('socket open');
            });

            ws.on('error', err => {
                if(errorHandler){
                errorHandler(err);}
                return reject(err);
            });
        });
    }

    /**
     * Unsubscribe from streaming requests.
     */
    unsubscribe(){
        if( ws != undefined){
            ws.stopStream();
        }
    }

    /**
     * Send response after execution.
     * @param {QueryResponse} response - The execution data return.
     */
    sendResponse(response) {

        let options;
        options = {
            'host': this.kubeMQHost,
            'port': this.kubeMQPort,
            'headers': { 'Content-Type': 'application/json'}
        };

        response.ClientID = this.client;

        options.method = 'POST';

        options.path = '/send/response';
        if (this.isSecure) {
            return httpExec.getHttpsRequest(response, options);

        } else {

            return httpExec.getRequest(response, options);
        }

    }

}

module.exports = rpc;
module.exports.Type = {
    Command: 1,
    Query: 2
};