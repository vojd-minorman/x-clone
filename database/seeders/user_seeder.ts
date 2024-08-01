import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        fullName : 'Neville Mitshiabu',
        email: 'mitshneville7@gmail.com',
        password: '123456789',
        avatar_url : 'images/nytimes-avatar.png',
        verified : true,
      },
    ])
  }
}
