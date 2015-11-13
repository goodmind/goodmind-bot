import { EventEmitter } from 'events';
import express from 'express';
import bodyParser from 'body-parser';
import nconf from 'nconf';

import BotClient from '../client/bot_client';

/**
 * @class
 */
export default class UpdatesServer extends EventEmitter {
    /**
     * @constructs
     * @param {BotClient} botClient
     */
    constructor(botClient) {
        super();

        /**
         * @member {BotClient}
         * @private
         */
        this._botClient = botClient;

        this._app = express();

        this.setMaxListeners(1000);

        this._start();
    }

    /**
     * @method
     * @private
     */
    _start() {
        let app = this._app;
        let token = this._botClient.token;

        app.set('port', (process.env.PORT || 5000));

        app.set('views', `${__dirname}/views`);

        app.set('view engine', 'ejs');

        app.use(express.static(`${__dirname}/public`));

        app.use(bodyParser.json());

        app.get('/', function (req, res) {
            res.render('index');
        });

        app.post(`/${token}/updates`, (req, res) => {
            let update = req.body;

            if (update.update_id) {
                this.emit('update', update);
            }

            res.send(req.body);
        });

        var server = app.listen(app.get('port'), () => {
            var host = server.address().address;
            var port = server.address().port;

            console.log('Example app listening at http://%s:%s', host, port);
        });
    }
}
