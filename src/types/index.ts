export interface Booking {
  id: string;
  user_id: string | null;
  pickup_date: string;
  pickup_time: string;
  service_type: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_address: string;
  pickup_address: string;
  special_instructions?: string;
  phone: string;
  full_name: string;
  created_at: string;
}

export interface RecurringPickup {
  id: string;
  user_id: string;
  service_type: 'wash_and_fold' | 'dry_clean' | 'press_only';
  pickup_day_of_week: number;
  pickup_time: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
}
