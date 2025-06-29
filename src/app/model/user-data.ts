// user.model.ts
export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  active: boolean;
  store_id: number;
}

export class UserData {
  constructor(
    public name: string,
    public email: string,
    public password: string,
    public role?: string,
    public customer?: Customer
  ) {}
}
