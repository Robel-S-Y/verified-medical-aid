import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { User } from './users.models';
import { Patient } from './patients.models';

export interface HospitalCreationAttrs {
  name: string;
  license_number: string;
  address: string;
  verified?: boolean;
  user_id: string;
}

@Table({
  tableName: 'hospitals',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Hospital extends Model<Hospital, HospitalCreationAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  license_number: string;

  @Column({ type: DataType.STRING, allowNull: false })
  address: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  verified: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, unique: true })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Patient)
  patient: Patient;
}
