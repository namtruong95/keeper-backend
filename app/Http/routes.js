'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')
const apiPrefix = '/api'

Route.on('/').render('welcome')

Route.group('unauthenticated', () => {
  /**
   * Sessions
   */
  Route.post('oauth/login', 'AuthController.login')
})
.prefix(apiPrefix)

Route.group('auth', () => {

  Route
  /**
   * Logout
   */
  .get('oauth/logout', 'AuthController.logout')
  /**
   * Users
   */
  .get('users', 'UserController.index')
  /**
   * Accounts
   */
  .get('accounts', 'AccountController.index')
  .post('accounts', 'AccountController.store')
  .get('accounts/:account_id', 'AccountController.show')
  .put('accounts/:account_id', 'AccountController.update')
  .delete('accounts/:account_id', 'AccountController.destroy')

})
.middleware(['auth:redisjwt'])
.prefix(apiPrefix)
