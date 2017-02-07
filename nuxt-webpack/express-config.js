"use strict";
var _ = require("lodash"),
  fs = require("fs");

function isRunningInDev(nodeEnv) {
  return nodeEnv === undefined || nodeEnv === "development" || nodeEnv === "test";
}

function getToken(nodeEnv) {
  if (isRunningInDev(nodeEnv)) {
    return "e62900b5-a18a-4227-b5e7-12d28a36f0b7";
  }
  if (nodeEnv === "staging") {
    return "1fa2e0fd-2eb4-4058-9f6c-24453da1a576";
  }
  if (nodeEnv === "sandbox") {
    return "69499560-ddcd-490d-a529-7ebc34cf6d3c";
  }
  return "4060c8d7-869e-4321-bf97-7fe2ba4516dc";
}

function getPort(env) {
  if (env.PORT) {
    return env.PORT;
  }
  return isRunningInDev(env.NODE_ENV) ? 8000 : 3000;
}

function getApplication(nodeEnv) {
  if (nodeEnv === "production") {
    return "https://app.betterez.com";
  }
  return isRunningInDev(nodeEnv) ? "http://localhost:8080" : `https://${nodeEnv}.betterez.com`;
}

function getApiPort(api) {
  var portToApi = {
    inventory: 3010,
    sales: 3020,
    reports: 3030,
    uploads: 3040,
    accounts: 3050,
    notifications: 3060,
    operations: 3070
  };
  return portToApi[api];
}

function getApiUrl(nodeEnv, api) {
  if (isRunningInDev(nodeEnv)) {
    var port = getApiPort(api);
    return "http://localhost:" + port + "/" + api;
  }
  if (nodeEnv === "production") {
    return "https://api.betterez.com/" + api;
  }
  return `https://${nodeEnv}-api.betterez.com/${api}`;
}

function getAuthConfig(nodeEnv) {
  var authConfig = {
    testKey: nodeEnv === "test" ? "test-api-key" : "",
    ignoredRoutes: [],
    collection: {
        name: "applications",
        property: "key"
      },
    db: getDbConfig(nodeEnv)
  };
  if (nodeEnv === "test") {
    authConfig.testUser = {_id: "test-api-key", accountId: "563c1457c4f260b0b7765569", privateKey: "private-key"};
    authConfig.testToken = "test-token";
  }
  return authConfig;
}

function getServiceDNS(serviceName, nodeEnv) {
  return isRunningInDev(nodeEnv) ? "localhost" : serviceName + "." + nodeEnv + ".btrz";
}

function getMongoOptions(nodeEnv) {
  if (isRunningInDev(nodeEnv)) {
    return {
      "database": "betterez_core",
      "username": "",
      "password": ""
    };
  }
  if (nodeEnv === "production") {
    return {
      database: "bz_prod",
      username: "betterez",
      password: "m0ng0!1A5A",
      slaveOk: false
    };
  }
  return {
    database: `bz_${nodeEnv}`,
    username: "betterez",
    password: "gong696stew773"
  };
}

function getMongoDbUris(nodeEnv) {
  if (isRunningInDev(nodeEnv)) {
    return ["127.0.0.1:27017"];
  }
  if (nodeEnv === "production") {
    return [
      getServiceDNS("mongo-server1", nodeEnv) + ":27017",
      getServiceDNS("mongo-server2", nodeEnv) + ":27017"
    ];
  }
  return [getServiceDNS("mongo1", nodeEnv) + ":27017"];
}

function getDbConfig(nodeEnv) {
  return {
    "options": getMongoOptions(nodeEnv),
    "uris": getMongoDbUris(nodeEnv)
  };
}

function getCdnUrl(env) {
  const nodeEnv = env.NODE_ENV;
  if (isRunningInDev(nodeEnv)) {
    return `http://localhost:${getPort(env)}/`;
  }
  if (nodeEnv === "production") {
    return "https://cdn.btrzapi.net/";
  }
  return `https://${nodeEnv}-cdn.btrzapi.net/`;
}

module.exports = function (env) {

  let config = {
    port: getPort(env),
    logentries: {
      token: getToken(env.NODE_ENV)
    },
    path: "cart2",
    db: getDbConfig(env.NODE_ENV),
    appDomain: getApplication(env.NODE_ENV),
    isProd: env.NODE_ENV === "production",
    inventoryApi: getApiUrl(env.NODE_ENV, "inventory"),
    salesApi: getApiUrl(env.NODE_ENV, "sales"),
    operationsApi: getApiUrl(env.NODE_ENV, "operations"),
    accountsApi: getApiUrl(env.NODE_ENV, "accounts"),
    authenticator: getAuthConfig(env.NODE_ENV),
    currencies: [
      {isocode: "USD", symbol: "$"},
      {isocode: "AUD", symbol: "$"},
      {isocode: "CAD", symbol: "$"},
      {isocode: "EUR", symbol: "€"},
      {isocode: "GBP", symbol: "£"},
      {isocode: "NZD", symbol: "$"}
    ],
    cdn: {
      url: getCdnUrl(env)
    },
  };
  if (isRunningInDev(env.NODE_ENV)) {
    try {
      fs.lstatSync(__dirname + "/express-config-dev.js");
      var overrides = require("./express-config-dev.js")(env);
      return _.merge({}, config, overrides);
    } catch (e) {
      // console.log("no development config found, starting with default config for localhost");
    }
  }

  return config;
};
