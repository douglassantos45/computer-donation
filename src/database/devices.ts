type DeviceProps = {
  value: string;
  name: string;
};

export const equipments: DeviceProps[] = [
  { value: 'notebook', name: 'Notebook' },
  { value: 'desktop', name: 'Desktop' },
  { value: 'netBook', name: 'NetBook' },
  { value: 'screen', name: 'Monitor' },
  { value: 'printer', name: 'Impressora' },
  { value: 'scanner', name: 'Scanner' },
];

export const states: DeviceProps[] = [
  {
    value: 'working',
    name: 'Tem todas as partes, liga e funciona normalmente',
  },
  { value: 'notWorking', name: 'Tem todas as partes, mas não liga mais' },
  {
    value: 'broken',
    name: ' Faltam peças, funciona só as vezes ou está quebrado',
  },
];
