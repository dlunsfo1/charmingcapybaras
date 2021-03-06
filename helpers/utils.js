const mongoose = require('mongoose');
var axios = require('axios');
const _ = require('underscore');
var config = require('../config/config');

const config = require('./../config/config');
mongoose.connect(`${config.database}`);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
var Agenda = require('./../database/models/agenda');

//HOST
var getUserAgenda = () => {
  axios
    .get('http://www.fridayhero.today/agendas')
    .then(response => {
      response.data.map(user => {
        return axios
          .get(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
              user.lat
            },${user.lng}&radius=1500&maxprice=${
              user.price_level
            }&type=restaurant&key=${process.env.GOOGLE_PLACES}`
          )
          .then(response => {
            // console.log(
            //   'response from google places ',
            //   response.data.results
            // );

            console.log('===============================');
            console.log(
              'response.data.results ',
              response.data.results[0].name
            );
            console.log('===============================');

            var venue = _.filter(response.data.results, item => {
              return (
                item.rating > user.rating
                // && item.price_level >= user.price_level
              );
            });
            console.log('===============================');
            // console.log('venue ', venue);
            console.log('===============================');

            // get the detail of specific venue
            return axios
              .get(
                `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
                  venue[0].place_id
                }&key=${process.env.GOOGLE_PLACES}`
              )
              .then(response => {
                console.log('in the details response', venue[0].place_id);
                let venueDetails = response.data.result;
                venueDetails.date = new Date();
                // console.log('venueDetails ', response.data.result);
                // return venueDetails;
                return axios
                  .get(
                    `https://api.darksky.net/forecast/${process.env.DARKSKY}/${
                      user.lat
                    },${user.lng}`
                  )
                  .then(response => {
                    let weatherSummary = response.data.daily.summary;
                    let weatherIcon = response.data.daily.icon;
                    console.log('--------------------------------');
                    console.log('the weather ', response.data.daily.summary);
                    console.log('--------------------------------');

                    // insert into datbase
                    console.log('--------------------------------');
                    console.log('helpers/utils.js user id ', user.user_id);
                    console.log('helpers/utils.js venu name ', venue[0].name);
                    console.log('helpers/utils.js weather ', weatherSummary);
                    console.log('--------------------------------');
                    console.log('--------------------------------');

                    venueDetails.weatherSummary = weatherSummary;
                    venueDetails.weatherIcon = weatherIcon;

                    Agenda.findOneAndUpdate(
                      { _id: user._id },
                      { $push: { agenda: venueDetails } },
                      { upsert: true },
                      () => {
                        console.log('inserted succsssfully');
                      }
                    );
                  })
                  .catch(err => {
                    console.log('err in weather ', err);
                  });
              })
              .catch(err => {
                console.log('problem with detail places call ', err);
              });
          })
          .catch(error => {
            console.log('error from the local data call', error);
          });
      });
    })
    .catch(error => {
      console.log('error in utils getUserAgenda ', error);
    });
};

module.exports = {
  getUserAgenda
};
