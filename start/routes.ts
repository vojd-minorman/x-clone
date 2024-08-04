/* eslint-disable prettier/prettier */
/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { HttpContext } from '@adonisjs/core/http'

const AuthController = () => import('#controllers/auth_controller')
const RegisterController = () => import('#controllers/registers_controller')
const ShowProfilsController = () => import('#controllers/show_profils_controller')

const tweets = [
  {
    id: 1,
    name: 'CNN',
    username: '@CNN',
    tweetAvatar: 'images/tweet-profile-photo.png',
    date: '7m',
    text: 'President Joe Biden touted a new agreement reached with the European Union to ease Trump-era tariffs on aluminum and steel as a "major breakthrough" that would serve to both strengthen the US steel industry and combat the global climate crisis.',
    comments: 57,
    retweets: 144,
    likes: 184,
    shares: 0,
    verified: true,
  },
  {
    id: 2,
    name: 'The New York Times',
    username: '@nytimes',
    date: '2h',
    tweetAvatar: 'images/nytimes-avatar.png',
    text: 'Gardening boomed during the pandemic. Six Black writers share how it has helped them re-establish, and reimagine, a connection to cultivation and the land.',
    image: 'images/tweet-image.png',
    comments: 19,
    retweets: 48,
    likes: 484,
    shares: 0,
    verified: true,
  },
  {
    id: 3,
    name: 'Tweeter',
    date: 'Oct 29',
    username: '@twitter',
    tweetAvatar: 'images/tweeter-avatar.png',
    text: 'BIG NEWS lol jk still Twitter',
    comments: '6.8K',
    retweets: '36.6K',
    likes: '267.1K',
    shares: 0,
    verified: true,
  },
  {
    id: 4,
    name: 'Tweeter',
    date: 'Oct 04',
    username: '@twitter',
    tweetAvatar: 'images/tweeter-avatar.png',
    text: 'hello literally everyone',
    comments: "116.7K",
    retweets: "785.5K",
    likes: "3.3M",
    shares: 0,
    verified: true

  },
  {
    id: 5,
    name: 'Twitter',
    username: '@twitter',
    date: '04 Oct',
    tweetAvatar: 'images/tweeter-avatar.png',
    text: 'hello literally everyone',
    image: 'images/tweet-image.png',
    comments: 19,
    retweets: 48,
    likes: 484,
    shares: 0,
    verified: true

  },
]



router.get('/', async (ctx: HttpContext) => {
  return ctx.response.redirect().toRoute('home')
})

// eslint-disable-next-line prettier/prettier



router.get('/login', [AuthController, 'loginForm']).as('login')

router.post('/login', [AuthController, 'login'])

router
  .post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())


router.get('/register', [RegisterController, 'registerForm']).as('register')

router.post('/register', [RegisterController, 'register'])

router.get('/home', [AuthController, 'showhome']).use(middleware.auth()).use(middleware.fetchTweets()).as('home')

router.get('/profile/:user_id', [ShowProfilsController, 'show']).as('profile.show').use(middleware.auth())

router.get('/profile/:id', [ShowProfilsController, 'myprofil']).as('profile.self').use(middleware.auth())

// router.get('/tweet', [TweetController, 'index']).as('index').use(middleware.auth())








