const foodNames:Record<string,string>={'Nasi putih':'rice','Ayam goreng':'chicken','Tempe orek':'tempe','Sayur sop':'soup','Pisang':'banana'};
export const foodPhoto=(type:string)=>`/images/${type}.webp`;
export const menuPhoto=(menu:string)=>foodPhoto(foodNames[menu]||'rice');
export function resolvePhoto(src:string, menu:string, failed=false) {
  const legacy=src==='/demo-weight.svg';
  const generated=Object.values(foodNames).some(type=>src===foodPhoto(type));
  const unavailable=failed||!src;
  return {src:legacy||unavailable?menuPhoto(menu):src,isDemo:legacy||generated||unavailable,unavailable};
}
