
export interface UserAuth {
    id:           string;
    email:        string | null;
    image?: string | null;
    user_name:    string;
    phone_number: string;
    role:         null;
    created_at:   string;
    updated_at:   string;
    password:     null;
    login_at?:    string | null;
    loginAt?:     string | null;
    s_id?:        string;
    s_name?:      string;
    s_phone_login?: string;
}
