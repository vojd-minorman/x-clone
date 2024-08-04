import { BaseSeeder } from '@adonisjs/lucid/seeders'
// import User from '#models/user'
import Tweet from '#models/tweet'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await Tweet.createMany([
      {
        user_id : 1,
        text: 'Mongoli',
        likes: 12,
        retweets : 4,
        shares: 3,
      },
      {
        user_id : 2,
        text: 'La gentille dame',
        likes: 12,
        retweets : 4,
        shares: 3,
      },
      {
        user_id : 4,
        text: 'Demoiselle dragon',
        likes: 12,
        retweets : 4,
        shares: 3,
      },
    ])
  }
}
