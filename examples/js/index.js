var axios = require('axios');
var qs = require('qs');

var data = qs.stringify({
    'code': 'val = int(input("Enter your value: ")) + 5\nprint(val)',
    'language': 'py',
    'input': '7'
});

var config = {
    method: 'post',
    url: 'https://api.codex.jaagrav.in',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });