'use strict'

const Env = use('Env')
const Helpers = use('Helpers')

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: 'pg',

  /*
  |--------------------------------------------------------------------------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://apnzfxuhjirnnm:47a4c2a1ff1fb50b6f2481878ea03c9885d1d6928cc2061e1671015a957e9435@ec2-54-163-254-143.compute-1.amazonaws.com:5432/dbtchqplvelfjr'
  }

}
