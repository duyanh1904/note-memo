import { CronJob } from 'cron';

const job = new CronJob(
	'* * * * * *', // cronTime
	function () {
		console.log('You will see this message every second');
	}, // onTick
	null, // onComplete
	true, // start
	'America/Los_Angeles' // timeZone
);
// job.start() is optional here because of the fourth parameter set to true.

export default job