import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Follow from '#models/follow'

export default class extends BaseSeeder {
  async run() {
    await Follow.createMany([
      {
        follower_id : 1,
        following_id : 4,
      },
      {
        follower_id : 1,
        following_id : 2,
      },

    ])
  }
}
