import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName : 'Neville Mitshiabu',
        email: 'daniel@gmail.com',
        password: '123456789',
        date_of_birth : '10/08/2021',
      },
    ])
  }
}
