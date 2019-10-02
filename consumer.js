const kafka = require('kafka-node');
const bp = require('body-parser');
const config = require('./config');

try {
  const Consumer = kafka.Consumer;
  const client = new kafka.KafkaClient(config.kafka_server);
  let consumer = new Consumer(
    client,
    [{ topic: config.kafka_topic, partition: 0 }],
    {
      autoCommit: true,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024,
      encoding: 'utf8',
      fromOffset: true
    }
  );
  consumer.on('message', async message => {
    console.log(message.value);
  });
  consumer.on('error', err => {
    console.log('Boy you suck', err);
  });
} catch (e) {
  console.log(e);
}
