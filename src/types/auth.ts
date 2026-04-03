
export interface UserAuth {
    id:           string;
    email:        null;
    user_name:    string;
    phone_number: string;
    role:         null;
    created_at:   Date;
    updated_at:   Date;
    password:     null;
    login_at?:    string | null;
    loginAt?:     string | null;
    s_id?:        string;
    s_name?:      string;
    s_phone_login?: string;
}
