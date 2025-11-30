export const makeid = () => {
  var text = '';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?:|.,';
  for (var i = 0; i < 20; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};
export const delay = (ms: number) => new Promise((resolve:any) => setTimeout(resolve, ms));

export const hasProperty = (obj: object, key: string) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export const query = (data:any) =>{
  return new URLSearchParams(
    Object.entries(data).reduce((acc, [key, value]) => {
      if (value != null) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
}

export const validatePhoneNumber = (phone: string): string => {
  // Remove all non-digit characters and leading zero
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.replace(/^0+/, '');
};

export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/^\+/, '').replace(/^0+/, '');
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = cleanPhoneNumber(phone);
  
  // If it starts with country code 855 (Cambodia), remove it
  if (cleaned.startsWith('855')) {
    return cleaned.substring(3);
  }
  
  return cleaned;
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
};
