
os = require("os");
http = require("http");
sleepless = require("sleepless");

var port = 5700;
var PING_FREQ = 5000;
var das_service = "sysmon";
var das_account = process.env["DAS_ACCOUNT"];
var das_secret = process.env["DAS_SECRET"];
var das_host = process.env["DAS_HOST"];


tick = function() {

	var o = {
		hostname: os.hostname(),
		type: os.type(),
		platform: os.platform(),
		arch: os.arch(),
		release: os.release(),
		uptime: os.uptime(),
		loadavg: os.loadavg(),
		cpus: os.cpus(),
		totalmem: os.totalmem(),
		freemem: os.freemem(),
		pingfreq: PING_FREQ,
	}
	
	var req = http.request({
		hostname: das_host,
		port: 5700,
		path: "/"+das_service+"/?account="+das_account+"&secret="+das_secret,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		}
	}, function(res) {
		res.setEncoding("utf8");
		res.on("data", function(x) { });
		res.on("end", function(x) { });
	});

	req.on("error", function(e) {
		console.log("req err "+e.message);
	});
	req.write(o2j(o));
	req.end();

	setTimeout(tick, PING_FREQ);
}

tick(); 


