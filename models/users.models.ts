import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Hospital } from './hospitals.models';
import { Donation } from './donations.models';

interface UserCreationAttrs {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'hospital' | 'donor';
  phone?: string;
}

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User, UserCreationAttrs> {
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

  @HasOne(() => Hospital)
  hospital: Hospital;

  @HasMany(() => Donation)
  donations: Donation;
}
