export interface Availability {
  id: string;
  type: string;
  attributes: AvailabilityAttributes;
}

export interface AvailabilityAttributes {
  date: string;
  available_hours: number;
} 