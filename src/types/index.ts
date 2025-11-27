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
