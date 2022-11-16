import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from 'http';
import CandleController from "../controllers/CandleController";
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessageChannel {
    private _channel: Channel;
    private _candleCtrl: CandleController;
    private _io: Server;

    constructor(server: http.Server) {
        this._candleCtrl = new CandleController();
        this._io = new Server(server, {
            cors: {
                origin: process.env.SOCKET_CLIENT_SERVER,
                methods: ['GET', 'POST'],
            },
        });

        this._io.on('connection', () => console.log('Web Socket connection has been created'));
    }

    private async _createMessageChannel() {
        try {
            const connection = await connect(process.env.AMQP_SERVER);

            this._channel = await connection.createChannel();
            this._channel.assertQueue(process.env.QUEUE_NAME);

        } catch (error) {
            console.log('Connection to RabbitMQ has failed');
            console.log(error);
        }
    }

    async consumeMessages() {
        await this._createMessageChannel();

        if (! this._channel) {
            return;
        }

        this._channel.consume(process.env.QUEUE_NAME, async (message) => {
            const candleObj = JSON.parse(message.content.toString());
            console.log('Message has been received');
            console.log(candleObj);

            this._channel.ack(message);

            const candle: Candle = candleObj;

            await this._candleCtrl.save(candle);

            console.log('Candle saved to database');

            this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
            console.log('New candle emited by web socket');
        });

        console.log('Candle consumer has been started');
    }
}