import { Table, Column, Model } from 'sequelize-typescript'
import sequelize from 'sequelize'

@Table({ timestamps: true, paranoid: true })
export class User extends Model<User> {
    @Column({
        primaryKey: true,
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4,
    })
    public id: string

    @Column(sequelize.STRING)
    public email: string

    @Column(sequelize.STRING)
    public name: string
}
