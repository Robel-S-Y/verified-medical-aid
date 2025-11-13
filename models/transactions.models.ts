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

@Table({ tableName: 'transactions', timestamps: true })
export class Transaction extends Model<Transaction> {
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

  @Column({ type: DataType.STRING, allowNull: false })
  reference_code: string;

  @Column({
    type: DataType.ENUM('Pending', 'Completed', 'Failed'),
    allowNull: false,
  })
  status: string;

  @BelongsTo(() => Donation)
  donation: Donation;
}
