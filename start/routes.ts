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
const FollowsController = () => import('#controllers/follows_controller')
const TweetsController = () => import('#controllers/tweets_controller')



router.get('/', async (ctx: HttpContext) => {
  return ctx.response.redirect().toRoute('home.index')
})

// eslint-disable-next-line prettier/prettier



router.get('/login', [AuthController, 'loginForm']).as('login')

router.post('/login', [AuthController, 'login'])

router
  .post('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())


router.get('/register', [RegisterController, 'registerForm']).as('register')

router.post('/register', [RegisterController, 'register'])

router.get('/home', [TweetsController, 'showHome']).use(middleware.auth()).as('home.index')

router.get('/profile/:user_id', [ShowProfilsController, 'show']).as('profile.show').use(middleware.auth())

router.get('/me/:id', [ShowProfilsController, 'profil']).as('me.profil').use(middleware.auth())



router.post('/follow', [FollowsController, 'followOrUnfollow']).as('follow').use(middleware.auth())
router.post('/unfollow', [FollowsController, 'followOrUnfollow']).as('unfollow').use(middleware.auth())


router.post('/tweet', [TweetsController, 'addTweet']).as('addTweet').use(middleware.auth())

// router.get('/posts', [TweetsController, 'show']).use(middleware.auth()).as('posts.show')

router.get('/api/tweet/paginate/:page', [TweetsController, 'paginate']).use(middleware.auth()).as('home.paginate')
