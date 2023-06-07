export interface Profile {
    pk: number;
    phone_number: string;
    username: string;
    firstname: string;
    lastname: string;
    city: string;
    email: string;
    street: string;
    apartmentnumber: number;
    housenumber: number;
    zipcode: number;
    profileimage: File;
    is_active: boolean;
    is_staff: boolean;
  }
  