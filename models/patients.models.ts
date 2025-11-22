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
import { Hospital } from './hospitals.models';
import { Donation } from './donations.models';

export interface PatientCreationAttrs {
  full_name: string;
  age: number;
  diagnosis: string;
  treatment_cost: number;
  document_url: string;
  hospital_id: string;
}
@Table({
  tableName: 'patients',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Patient extends Model<Patient, PatientCreationAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  full_name: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  age: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  diagnosis: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  treatment_cost: number;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
    defaultValue: 0,
  })
  paid_amount: number;

  @Column({
    type: DataType.VIRTUAL,
    get(this: Patient) {
      return Number(this.treatment_cost) - Number(this.paid_amount);
    },
  })
  remaining_amount: number;

  @Column({
    type: DataType.ENUM('NEED', 'TREATING', 'DONE'),
    allowNull: false,
    defaultValue: 'NEED',
  })
  treatment_status: string;

  @Column({ type: DataType.STRING, allowNull: false })
  document_url: string;

  @Column({
    type: DataType.ENUM('pending', 'verified', 'rejected'),
    allowNull: false,
    defaultValue: 'pending',
  })
  verification_status: string;

  @ForeignKey(() => Hospital)
  @Column({ type: DataType.UUID, allowNull: false })
  hospital_id: string;

  @BelongsTo(() => Hospital)
  hospital: Hospital;

  @HasMany(() => Donation)
  donations: Donation;
}
