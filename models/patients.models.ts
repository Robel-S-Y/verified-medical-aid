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
import { Hospital } from './hospitals.models';

@Table({ tableName: 'hospitals', timestamps: true })
export class Patient extends Model<Patient> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  full_name: string;

  @Column({ type: DataType.INTEGER, allowNull: false, unique: true })
  age: number;

  @Column({ type: DataType.TEXT, allowNull: false })
  diagnosis: string;

  @Column({
    type: DataType.DECIMAL,
    allowNull: false,
  })
  treatment_cost: number;

  @Column({
    type: DataType.ENUM('NEED', 'TREATING', 'DONE'),
    allowNull: false,
  })
  status: string;

  @Column({ type: DataType.STRING, allowNull: false })
  document_url: string;

  @ForeignKey(() => Hospital)
  @Column({ type: DataType.UUID })
  hospital_id: string;

  @BelongsTo(() => Hospital)
  hospital: Hospital;
}
