'use strict';

var _ = require('lodash');
var http = require('request');
var env = require('../../config/constants');


exports.index = function(req, res){
  var req_ip = "";
  var req_cur = "";
  var forwarded_for = "";
  forwarded_for = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if(forwarded_for.includes(',')){
     forwarded_for = forwarded_for.split(',')[0];
  }
  console.log('req ip',req.ip,'forwarded for ip', forwarded_for);

  req_ip = forwarded_for === "127.0.0.1" ? '' : forwarded_for;

  function countries(country){
    var country = country ? country : {};
    http
      .get({
      uri: env.spree.host+env.spree.countries+'/all.json',
      headers:{'content-type': 'application/json'},
      body:''
    },function(error,response,body){
      if(error == null){
        res.status(response.statusCode).send({requested_country: country, countries: body});
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }

      });
  }

  http
    .get({
      uri: 'http://freegeoip.net/json/'+req_ip
    }, function(error, response, body){
        if(error){
          console.log('error getting location', error.syscall);
          countries();
        }
        else{
          countries(body);
        };



  });


  };

  exports.search = function(req, res){
    console.log(req.query);
    req.query.token = '99da15069ef6b38952aa73d4550d88dd266fc302a4c8b058';
    var qstr = ''
    for(var x in req.query){
      if(typeof req.query[x]=='object'){
        for(var y in req.query[x]){
          qstr=qstr+x+'['+y+']='+req.query[x][y]+'&'
        }
      }
      else{
        qstr=qstr+x+'='+req.query[x]+'&'
      }
    }
    http.get(env.spree.host+env.spree.countries+'?'+qstr,function(error, response, body){
      if(error == null){
        res.status(response.statusCode).send(body);
      }
      else{
        res.status(500).send("Rails Server Not Responding");
      }
    });
  }
