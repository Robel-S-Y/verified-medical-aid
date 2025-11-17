export class HospitalResponseDto {
  message;
  hospital: {
    id: string;
    name: string;
    license_number: string;
    address: string;
    verified: boolean;
    user_id: string;
  };
}
