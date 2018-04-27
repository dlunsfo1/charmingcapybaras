const nodemailer = require('nodemailer');
//const archive = require('../../helpers/email-helper');
var axios = require('axios');
// const config = require('../../config/config');
// var cron = require('cron');
// var CronJob = require('cron').CronJob;
// // '*/1 * * * '
// new CronJob(
//   process.env.EMAIL_CHRON,
//   function() {
//     console.log('cronjob running');
//     getEmailAddresses();
//   },
//   null,
//   true,
//   'America/Los_Angeles'
// );

//let result = archive.getEmails();

var getEmailAddresses = () => {
  axios
    .get(`${process.env.HOST}/api/user`)
    .then(response => {
      console.log('Retrieved emails');
      //return response.data[1].emailaddress;
      let users = response.data;
      users.forEach(account => sendEmails(account.email));
    })
    .catch(err => {
      console.log(err);
    });
};

let sendEmails = email => {
  let transporter = nodemailer.createTransport(
    {
      host: process.env.MAIL_SRV,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USR,
        pass: process.env.MAIL_PWD
      }
    },
    {
      from: 'Friday Hero <BeAHero@fridayhero.today>'
    }
  );

  let message = {
    to: `<${email}>`,
    subject: "It's Friday, we know what you're doing today.",
    text:
      "Visit http://www.fridayhero.today/agenda to see find out what you're doing today.",
    html:
      '<p>Visit <a href="http://www.fridayhero.today/agenda">http://www.fridayhero.today/agenda</a> to see find out what you\'re doing today.</p>'
  };

  transporter.sendMail(message, (error, info) => {
    if (error) {
      console.log('Error Occurred: ', error.message);
      return process.exit(1);
    }

    console.log('Message sent');
    console.log(nodemailer.getTestMessageUrl(info));
  });
};

// getEmailAddresses();
module.exports = {
  getEmailAddresses
};
