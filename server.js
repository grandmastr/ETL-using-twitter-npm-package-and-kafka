const Twit = require("twit");

const T = new Twit({
  consumer_key: "BSu45Bjg7VnIpdLh54wUHMuCx",
  consumer_secret: "Uy8wHfdDOqWzYwRbqeVOPCmpjHHvxcGQwtQ7kexInOihqM7qMr",
  access_token: "1148876239274500096-YVcsYBO3RfWPYqUW17D717voCeTcw1",
  access_token_secret: "vZ7wItwK19qlb4OcbecPhoUPVPpM2aMwY9nik9G9Wp7tb",
  timeout_ms: 60 * 1000,
  strictSSL: true
});

T.get(
  "search/tweets",
  {
    q: "Buhari since:2019-01-01"
  },
  (err, data, response) => {
    console.log(JSON.stringify(data));
  }
);
