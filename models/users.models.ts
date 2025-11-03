import {
  Table,
  Column,
  Model,
  DataType,
  //ForeignKey,
  // BelongsTo,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column(DataType.STRING)
  phone: string;

  @Column({
    type: DataType.ENUM('admin', 'hospital', 'donor'),
    allowNull: false,
  })
  role: string;

  @Column(DataType.STRING)
  status: string;
}
