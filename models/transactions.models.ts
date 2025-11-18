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
import { Donation } from './donations.models';

export interface TransactionCreationAttrs {
  donation_id: string;
  gateway: string;
}
@Table({
  tableName: 'transactions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Transactions extends Model<
  Transactions,
  TransactionCreationAttrs
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Donation)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  donation_id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  gateway: string;

  @Column({ type: DataType.STRING, allowNull: true })
  payment_intent_id: string;

  @Column({
    type: DataType.ENUM('Pending', 'Completed', 'Failed'),
    allowNull: false,
    defaultValue: 'Pending',
  })
  status: string;

  @Column({ type: DataType.JSONB, allowNull: true })
  gateway_response: any;

  @BelongsTo(() => Donation)
  donation: Donation;
}
