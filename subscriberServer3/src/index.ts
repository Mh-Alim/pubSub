import express from "express";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();
const app = express();

app.use(express.json());

// db
const subscribers: any = {};

app.post("/subscribe", (req: any, res: any) => {
  const { topic } = req.body;
  if (!topic) return res.status(500).json({ message: "topic cant be empty" });

  if (!subscribers[topic]) {
    subscribers[topic] = [];
    redisClient.subscribe(topic, (message) => {
      subscribers[topic].forEach((callback: any) => callback(message));
    });
  }
  subscribers[topic].push((message: string) => {
    console.log(`Server3 received messaged on ${topic}, msg: ${message}`);
  });
  res.status(200).json({ message: `Server3 Subscribed to topic: ${topic}` });
});


app.listen(6000, () => {
  console.log("Subscriber is running on port 6000");
});
