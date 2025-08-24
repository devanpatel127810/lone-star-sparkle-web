export interface Booking {
  id: string;
  user_id: string;
  pickup_date: string;
  pickup_time: string;
  service_type: 'wash_and_fold' | 'dry_clean' | 'press_only';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  customer_name: string;
  customer_phone: string;
  customer_address: string;
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
