import { CronJob } from 'cron';
import PostMessage from '../../server/models/postMessage.js';

let count = 1;
const job = new CronJob(
  '0 * * * * *', // cronTime: runs every minute when seconds are 0
	function () {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    count++
		console.log('cron run');
    const post = new PostMessage({
      creator: 999,
      createdAt: new Date().toISOString(),
      name: 'Image for API random' + count,
      resource: 'from cron job',
      selectedFile: 'https://images.pexels.com/photos/'+randomNumber+'/pexels-photo-'+randomNumber+'.jpeg'
    })
    const isSuccess = post.save();
    console.log(post,isSuccess);
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.

export default job