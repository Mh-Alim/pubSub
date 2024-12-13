import express from "express";
import { createClient } from "redis";

const redisClient = createClient();
redisClient.connect();
const app = express();

app.use(express.json());
app.post("/publish", async (req: any, res: any) => {
  const { topic, article } = req.body;
  if (!topic || !article)
    return res.status(400).json({ message: "topic / article cant be empty" });

  try {
    await redisClient.publish(topic, article);
    res.status(200).json({ message: `Article published to topic: ${topic}` });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: "Error publishing article", details: err.message });
  }
});
app.listen(3000, () => {
  console.log("Publisher is running on port 3000");
});
