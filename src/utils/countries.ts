export interface Country {
  name: string;
  code: string;
  dial_code: string;
  flag: string;
}

export const countries: Country[] = [
  { name: "Cambodia", code: "KH", dial_code: "+855", flag: "🇰🇭" },
  { name: "Thailand", code: "TH", dial_code: "+66", flag: "🇹🇭" },
  { name: "Vietnam", code: "VN", dial_code: "+84", flag: "🇻🇳" },
  { name: "Malaysia", code: "MY", dial_code: "+60", flag: "🇲🇾" },
  { name: "Singapore", code: "SG", dial_code: "+65", flag: "🇸🇬" },
  { name: "Philippines", code: "PH", dial_code: "+63", flag: "🇵🇭" },
  { name: "Indonesia", code: "ID", dial_code: "+62", flag: "🇮🇩" },
  { name: "Laos", code: "LA", dial_code: "+856", flag: "🇱🇦" },
  { name: "Myanmar", code: "MM", dial_code: "+95", flag: "🇲🇲" },
  { name: "Brunei", code: "BN", dial_code: "+673", flag: "🇧🇳" },

  { name: "United States", code: "US", dial_code: "+1", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", dial_code: "+44", flag: "🇬🇧" },
  { name: "China", code: "CN", dial_code: "+86", flag: "🇨🇳" },
  { name: "Japan", code: "JP", dial_code: "+81", flag: "🇯🇵" },
  { name: "South Korea", code: "KR", dial_code: "+82", flag: "🇰🇷" }
];
