export class PatientResponseDto {
  message;
  patient: {
    id: string;
    full_name: string;
    age: number;
    diagnosis: string;
    treatment_cost: number;
    treatment_status: string;
    document_url: string;
    verification_status: string;
    hospital_id: string;
  };
}
