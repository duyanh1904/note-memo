import { CronJob } from "cron"
import PostMessage from "../../server/models/postMessage.js"
import fetch from "node-fetch"

// Define async function outside the cron job
const generateImageEveryMinute = async () => {
  try {
    const quote = await getRandomQuote()

    console.log("cron run")
    const randomId = Math.floor(Math.random() * 1001);

    const post = new PostMessage({
      creator: 999,
      createdAt: new Date().toISOString(),
      resource: "from cron job",
      message: quote["content"],
      name: quote["author"],
      title: "Quote by " + quote["author"],
      tags: quote["tags"],
      selectedFile: `https://picsum.photos/id/${randomId}/200/300`,
    })

    // Wait for the save operation to complete
    const isSuccess = await post.save()
    console.log(post, isSuccess)
  } catch (error) {
    console.error("Error in cron job:", error)
  }
}

const job = new CronJob(
  "2 * * * * *", // cronTime: runs every minute when seconds are 0
  generateImageEveryMinute, // onTick: Execute the async function
  null, // onComplete
  true, // start
  "America/Los_Angeles" // timeZone
)

// job.start() is optional here because of the fourth parameter set to true.


async function getRandomQuote() {
  const response = await fetch("http://api.quotable.io/random")
  const json = await response.json()
  return json
}
export default job
