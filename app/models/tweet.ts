import { DateTime } from 'luxon'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import { column, BaseModel, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import Comment from '#models/comment'
import User from '#models/user'


export default class Tweet extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare user_id: number

  @column()
  declare text: string

  @column()
  declare likes: number

  @column()
  declare retweets: number

  @column()
  declare shares: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @belongsTo(() => User)
  declare users: BelongsTo<typeof User>

}
