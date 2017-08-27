'use strict'

/*
|--------------------------------------------------------------------------
| Database Seeder
|--------------------------------------------------------------------------
| Database Seeder can be used to seed dummy data to your application
| database. Here you can make use of Factories to create records.
|
| make use of Ace to generate a new seed
|   ./ace make:seed [name]
|
*/

// const Factory = use('Factory')
const User = use('App/Model/User')

class DatabaseSeeder {

  * run () {
    yield User.createMany([
      {
        name: 'Keeper Admin',
        email:'namzee.root@gmail.com',
        password: 'Thanhnam27031995',
        role: User.ROLES.ADMIN
      },
      {
        name: 'Thanh Nam',
        email:'namzee@gmail.com',
        password: 'Thanhnam27031995',
        role: User.ROLES.MEMBER
      }
    ])
  }

}

module.exports = DatabaseSeeder
