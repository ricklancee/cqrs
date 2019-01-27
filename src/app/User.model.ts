import { Table, Column, Model } from 'sequelize-typescript'
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions'
import sequelize = require('sequelize')

@Table
export class User extends Model<User> {
    @Column(sequelize.STRING)
    public email: string
}
