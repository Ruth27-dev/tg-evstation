export interface Station {
    content:        Content[];
    page:           number;
    size:           number;
    total_elements: number;
    total_pages:    number;
    last:           boolean;
}



export interface Content {
    id:           string;
    address:      string;
    country_code: string;
    latitude:     string;
    longitude:    string;
    name:         string;
    status:       string;
    created_at:   Date;
    updated_at:   Date;
    chargers:     Charger[];
    restrooms:    boolean;
    wifi:         boolean;
    playground:   boolean;
    parking_fee:  boolean;
    cafe:         boolean;
    shopping:     boolean;
    phone_number: string;
    image:        string;
    distance?:    string;
    availableChargers?: number;
    totalChargers?: number;
    price?:       string;
}

export interface Charger {
    id:               string;
    charge_point_id:  string;
    created_at:       Date;
    firmware_version: string;
    ip_address:       null;
    last_heartbeat:   Date;
    model:            string;
    serial_number:    null;
    status:           string;
    vendor:           string;
    location:         string;
    location_id:      string;
    connector:        Connector[];
}

export interface Connector {
    id:               string;
    connector_number: number;
    created_at:       Date;
    updated_at:       Date;
    status:           string;
    charger_id:       string;
    max_kw:           null;
    type:             null;
}

export interface Transaction {
    id:             string;
    amount:         number;
    amount_display: string;
    type:           string;
    status:         string;
    external_ref:   string;
    created_at:     Date;
}

export interface Pagination {
    page:           number;
    size:           number;
    total_elements: number;
    total_pages:    number;
    last:           boolean;
}

export type NotificationType = 'normal' | 'announcement';

export interface Notification {
    id:             string;
    type:           NotificationType;
    title:          string;
    message:        string;
    created_at:     Date;
    read:           boolean;
    icon?:          string;
    action?:        string;
}

export interface History {
    session_id:            string;
    status:                string;
    energy_kwh:            number;
    current_soc:           number;
    minutes_remaining:     null;
    estimated_finish_time: null;
    started_at:            Date;
    last_update_at:        Date;
    price_so_far:          number;
    max_amount_cents:      null;
}
export interface EVStartResponse {
  status: string
  message: string
  charger_point_id: string
  connector_number: number
  connector_id: string
  session_id: any
}

export interface SessionDetail {
  session_id: string
  status: string
  energy_kwh: number
  current_soc: number
  minutes_remaining: number
  estimated_finish_time: string
  started_at: string
  last_update_at: string
  price_so_far: number
  max_amount_cents: any
  ocpp_transaction_id: number
}

export interface ContactResponse {
  id: string
  email: string
  phone: string
  telegram: string
  created_at: string
}

export interface FAQResponse {
  id: string
  question: string
  answer: string
  status: string
  created_at: string
}
