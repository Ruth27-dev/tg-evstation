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