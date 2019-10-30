const Twitter = require("twitter"),
  redis = require("redis"),
  client = redis.createClient(),
  kafka = require("kafka-node"),
  bp = require("body-parser"),
  config = require("./config"),
  cron = require("node-cron");

require("dotenv").config();

client.on("connect", () => {
  console.log(
    "Connected to the redis database successfully, fetching details, and proceeding to pushing to kafka now..."
  );
});

const twitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.TOKEN,
  access_token_secret: process.env.TOKEN_SECRET
});

twitterClient.stream(
  "statuses/filter",
  {
    track: "Lagos,Buhari, Nigeria"
  },
  stream => {
    stream.on("data", event => {
      let user_id;
      client.exists(event.user.name, (err, reply) => {
        if (reply === 1) {
          client.get(event.user.name, (err, reply) => {
            user_id = reply;
          });
        } else {
          user_id = event.user.id;
          client.set(event.user.name, user_id);
        }

        let data = {
          tweet_id: event.id,
          source: event.source,
          tweet: event.text,
          retweeted: event.retweeted,
          retweet_count: event.retweet_count,
          created_at: event.created_at,
          username: event.user.name,
          profile_img_url: event.user.profile_image_url,
          followers: event.user.followers_count,
          user_id: user_id || event.user.id
        };

        // the time can be adjusted to whatever you want
        cron.schedule("* * * * * *", () => {
          try {
            const Producer = kafka.Producer;
            const client = new kafka.KafkaClient(config.kafka_server);
            const producer = new Producer(client);
            const kafka_topic = config.kafka_topic;
            
            let payloads = [
              {
                topic: kafka_topic,
                messages: JSON.stringify(data)
              }
            ];
    
            producer.on("ready", async () => {
              let push_status = producer.send(payloads, (err, data) => {
                if (err) {
                  console.log(
                    `[theGrandmaster -> ${kafka_topic}]: broker update failed`
                  );
                } else {
                  console.log(
                    `[theGrandmaster -> ${kafka_topic}]: broker update freaking successful`
                  );
                }
              });
            });
    
            producer.on("error", function(err) {
              console.log(err);
              console.log(
                `[theGrandmaster -> ${kafka_topic}]: broker update errored`
              );
              throw err;
            });
          } catch (e) {
            console.log(e);
          }
        })
      });
    });
    stream.on("error", error => {
      throw error;
    });
  }
);
