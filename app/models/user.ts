import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Tweet from '#models/tweet'
import Follow from '#models/follow'
import Comment from '#models/comment'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string | null

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare date_of_birth: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Tweet)
  declare tweets: HasMany<typeof Tweet>

  @hasMany(() => Follow)
  declare follows: HasMany<typeof Follow>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

}
