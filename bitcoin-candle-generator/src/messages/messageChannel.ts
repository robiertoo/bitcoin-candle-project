import { config } from 'dotenv';
import { Channel, connect } from 'amqplib';

const createMessageChannel = async (): Promise<Channel> => {
    config();

    try {
        const connection = await connect(process.env.AMQP_SERVER);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME);

        console.log('connected to rabbitMq');

        return channel;
    } catch (error) {
        console.log('Error while trying to connect to RabbitMQ');
        console.log(error);
    }
}

export default createMessageChannel;