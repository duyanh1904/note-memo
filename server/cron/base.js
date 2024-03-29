import { CronJob } from 'cron';
import PostMessage from '../../server/models/postMessage.js';
import fetch from "node-fetch";

let count = 1;

// Define async function outside the cron job
const generateImageEveryMinute = async () => {
  try {
    const imageUrl = await getShibaRandomImage();
    const quote = await getRandomQuote();
    const randomNumber = Math.floor(100 + Math.random() * 9);
    count++;

    console.log('cron run');
    
    const post = new PostMessage({
      creator: 999,
      createdAt: new Date().toISOString(),
      name: 'Image for API random' + count,
      resource: 'from cron job',
      message: quote['content'],
      name: quote['author'],
      tags: quote['tags'],
      selectedFile: imageUrl
    });

    // Wait for the save operation to complete
    const isSuccess = await post.save();
    console.log(post, isSuccess);
  } catch (error) {
    console.error('Error in cron job:', error);
  }
};

const job = new CronJob(
  '2 * * * * *', // cronTime: runs every minute when seconds are 0
	generateImageEveryMinute, // onTick: Execute the async function
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);

// job.start() is optional here because of the fourth parameter set to true.

async function getShibaRandomImage() {
  const response = await fetch('https://shibe.online/api/shibes?count=1');
  const json = await response.json();
  return json[0];
}
async function getRandomQuote() {
  const response = await fetch('https://api.quotable.io/random');
  const json = await response.json();
  return json;
}
export default job;
