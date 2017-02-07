"use strict";

let express = require("express"),
  cluster = require("cluster"),
  compression = require("compression"),
  Logger = require("btrz-logger").Logger,
  ConsoleLogger = require("btrz-logger").ConsoleLogger,
  SilentLogger = require("btrz-logger").SilentLogger,
  LogEntriesLogger = require("btrz-logger").LogEntriesLogger,
  cors = require("cors"),
  bodyParser = require("body-parser"),
  http = require("http"),
  config = require("./express-config")(process.env),
  SimpleDao = require("btrz-simple-dao").SimpleDao,
  Authenticator = require("btrz-auth-api-key"),
  requestLanguage = require("express-request-language"),
  morgan = require("morgan"),
  logger = new Logger(),
  consoleLogger = new ConsoleLogger(),
  silentLogger = new SilentLogger(),
  logEntriesLogger = null,
  envInfo = require("btrz-env-info"),
  staticFile = require("connect-static-file");

let app = module.exports = express();
let simpleDao = new SimpleDao(config);

logger.addLogger(consoleLogger);
if (config.logentries && config.logentries.token) {
  logEntriesLogger = new LogEntriesLogger(config.logentries);
  logger.addLogger(logEntriesLogger);
}

function inAws() {
  return process.env.NODE_ENV && process.env.NODE_ENV !== "test";
}

function getHttpLogger() {
  if (inAws()) {
    return logEntriesLogger;
  }
  if (process.env.NODE_ENV !== "test") {
    return consoleLogger;
  }
  return silentLogger;
}

app.set("config", config);
app.logger = logger;
app.db = simpleDao;
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(compression());
app.use(cors());
app.set("view engine", "ejs");
app.use(requestLanguage({
  languages: ["en", "fr"]
}));
/*app.use(function (req, res, next) {
  function register() {
    const dynamicHelpers = require("./middleware/dynamic-helpers");
    Object.keys(dynamicHelpers).forEach((key) => {
      res.locals[key] = dynamicHelpers[key]
        .call(res.app, config, req, res);
    });
    next();
  }
  envInfo.getInfo()
    .then((result) => {
      req.app.CONFIG = {};
      req.app.CONFIG.env = result;
      register();
    })
    .catch((err) => {
      register();
    });
});*/
morgan.format("combined-time", 'remoteaddr=:remote-addr responsetime=:response-time[1] remoteuser=:remote-user date=[:date[clf]] method=:method url=":url" http=:http-version status=:status responselength=:res[content-length] referrer=":referrer" useragent=":user-agent"')
app.use(morgan("combined-time", { stream: getHttpLogger() }));
app.use(`/${config.path}/dist`, express.static("dist"));
app.use(`/${config.path}/static`, express.static("static"));
app.use(`/${config.path}/locales`, express.static("locales"));



// Nuxt configuration start
//app.use('/api', require("./api/index"));
let nuxtConfig = require("./nuxt.config.js");
const Nuxt = require('nuxt');
const nuxt = new Nuxt(nuxtConfig);
app.use(nuxt.render);
if (!config.isProd) {  // Build only in dev mode
  nuxt.build()
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
      process.exit(1);
    });
}
// Nuxt configuration end


app.use(function (err, req, res, next) {
  logger.fatal("500: Internal Server Error", err);
  res.send('500: Internal Server Error', 500);
});

//require("./resources")(app, config, logger, simpleDao);

process.on("uncaughtException", (err) => {
  try {
    logger.fatal("UNCAUGHT EXCEPTION", err);
  } catch (e) {
    console.log("UNCAUGHT EXCEPTION:", e);
  }
});

process.on('unhandledRejection', (err) => {
  try {
    logger.fatal("UNHANDLED REJECTION", err);
  } catch (e) {
    console.log("UNHANDLED REJECTION", e);
  }
});

cluster.on("exit", function (worker) {
  logger.fatal(`Process ${worker.id} died`);
  cluster.fork();
});

if (cluster.isMaster && process.env.NODE_ENV && process.env.NODE_ENV !== "test") {
  var cpuCount = require("os").cpus().length;
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork();
  }
} else {
  http.createServer(app).listen(config.port, function () {
    let clusterId = cluster && cluster.worker ? cluster.worker.id : "t";
    logger.info(`Started - node_version ${process.version} - env ${process.env.NODE_ENV} - cluster ${clusterId} - port ${config.port}`);
  });
}
