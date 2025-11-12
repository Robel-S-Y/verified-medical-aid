import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { User } from './users.models';

@Table({ tableName: 'hospitals', timestamps: true })
export class Hospital extends Model<Hospital> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  license_number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  adress: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  role: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
}
