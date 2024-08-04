import type { HttpContext } from '@adonisjs/core/http'
// import User from '#models/user'
import Tweet from '#models/tweet'
export default class TweetsController {

  async index({ view }: HttpContext) {
    const tweets = await Tweet.all()
    console.log(tweets);

    return view.render('pages/home', { tweets })
  }
}
