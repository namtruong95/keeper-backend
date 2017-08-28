'use strict'

/*
|--------------------------------------------------------------------------
| Redis Configuaration
|--------------------------------------------------------------------------
|
| Here we define the configuration for redis server. A single application
| can make use of multiple redis connections using the redis provider.
|
*/

const Env = use('Env')

module.exports = {

  /*
  |--------------------------------------------------------------------------
  | connection
  |--------------------------------------------------------------------------
  |
  | Redis connection to be used by default.
  |
  */
  connection: Env.get('REDIS_CONNECTION', 'local'),

  /*
  |--------------------------------------------------------------------------
  | local connection config
  |--------------------------------------------------------------------------
  |
  | Configuration for a named connection.
  |
  */

  local: Env.get('REDIS_URL') || 'redis://h:p260a1877f25bad73ddad2b3a6ced526e1e4494edb5a817a9523a6c077761e5a6@ec2-34-226-55-20.compute-1.amazonaws.com:57289',

  // local: {
  //   host: Env.get('CACHE_HOST', '127.0.0.1'),
  //   port: Env.get('CACHE_PORT', 6379),
  //   password: null,
  //   db: 0,
  //   keyPrefix: Env.get('CACHE_PREFIX', '')
  // },

  /*
  |--------------------------------------------------------------------------
  | cluster config
  |--------------------------------------------------------------------------
  |
  | Below is the configuration for the redis cluster.
  |
  */
  cluster: {
    clusters: [{
      host: '127.0.0.1',
      port: 6379,
      password: null,
      db: 0
    },
    {
      host: '127.0.0.1',
      port: 6380,
      password: null,
      db: 0
    }]
  }

}
