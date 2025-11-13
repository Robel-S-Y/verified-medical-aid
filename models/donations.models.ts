import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { Patient } from './patients.models';
import { User } from './users.models';
import { Transaction } from './transactions.models';

@Table({ tableName: 'donations', timestamps: true })
export class Donation extends Model<Donation> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  donor_id: string;

  @ForeignKey(() => Patient)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  patient_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  guest_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  guest_email: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amount: number;

  @Column({ type: DataType.STRING, allowNull: false })
  transaction_id: string;

  @Column({
    type: DataType.ENUM('Pending', 'Completed'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  payment_status: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Patient)
  patient: Patient;

  @HasMany(() => Transaction)
  transaction: Transaction;
}
