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
import { Transactions } from './transactions.models';

export interface DonationCreationAttrs {
  donor_id: string;
  Patient_id: string;
  guest_name: string;
  guest_email: string;
  isAnonymous: boolean;
  amount: number;
}
@Table({
  tableName: 'donations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Donation extends Model<Donation, DonationCreationAttrs> {
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
  Patient_id: string;

  @Column({ type: DataType.STRING, allowNull: true })
  guest_name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  guest_email: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAnonymous: boolean;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  amount: number;

  @Column({ type: DataType.UUIDV4, allowNull: true })
  latest_transaction_id: string;

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

  @HasMany(() => Transactions)
  transaction: Transactions;
}
