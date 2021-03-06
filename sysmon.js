
fs = require("fs");
os = require("os");
fs = require("fs");
http = require("http");
sleepless = require("sleepless");

var port = 5700;
var PING_FREQ = 60 * 1000;
var das_service = "sysmon";

var home = process.env["HOME"];

var a = fs.readFileSync(home+"/.sysmon", {encoding:"utf8"}).split("\n");
das_host = a[0];
das_account = a[1];
das_secret = a[2];

hostname = os.hostname();

argv = process.argv;
if(argv.length >= 3) {
	hostname = argv[2];
}


tick = function() {

	var o = {
		hostname: hostname,
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


