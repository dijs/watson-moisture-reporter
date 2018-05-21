const jsonSql = require('json-sql')({
  dialect: 'postgresql',
  namedValues: false,
});
const { Client } = require('pg');
const http = require('http');
const debug = require('debug');

const log = debug('watson:reporter:moisture:report');

const tableQuery = `
CREATE TABLE IF NOT EXISTS moistures (
  "moisture" DECIMAL,
  "time" TIMESTAMPTZ,
  "location" TEXT
)`;

const preformQuery = (...args) => {
  const client = new Client(process.env.DB_CONNECTION);
  return client
    .connect()
    .then(() => client.query(...args))
    .then(() => client.end())
    .then(() => {
      log('Sent new record to DB');
    });
};

preformQuery(tableQuery);

const report = ({ moisture, time, location }) => {
  const sql = jsonSql.build({
    type: 'insert',
    table: 'moistures',
    values: {
      moisture,
      time,
      location,
    },
  });
  const url = `${
    process.env.REPORTING_SERVER
  }/moisture/${moisture}/${location}/${time}`;
  http.get(url).on('error', err => {
    log('Could not report to watson', err.message);
  });
  return preformQuery(sql.query, sql.values);
};

module.exports = report;
