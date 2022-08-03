type InstituionsProps = {
  id: number;
  name: string;
  city: string;
  district: string;
  description: string;
  social: [
    {
      name: string;
      url: string;
    },
    {
      name: string;
      url: string;
    },
  ];
};

export const institutions: InstituionsProps[] = [
  {
    id: 1,
    name: 'Company(1)',
    city: 'City(1)',
    district: 'Bairro(1)',
    description: 'Description(1)',
    social: [
      {
        name: 'Instagram',
        url: 'instagram.com',
      },
      {
        name: 'Facebook',
        url: 'facebook.com',
      },
    ],
  },
  {
    id: 2,
    name: 'Company(2)',
    city: 'Company(2)',
    district: 'Bairro(2)',
    description: 'Description(2)',
    social: [
      {
        name: 'Instagram',
        url: 'instagram.com',
      },
      {
        name: 'Facebook',
        url: 'facebook.com',
      },
    ],
  },
  {
    id: 3,
    name: 'Company(3)',
    city: 'City(3)',
    district: 'Bairro(3)',
    description: 'Description(3)',
    social: [
      {
        name: 'Instagram',
        url: 'instagram.com',
      },
      {
        name: 'Facebook',
        url: 'facebook.com',
      },
    ],
  },
  {
    id: 4,
    name: 'Company(4)',
    city: 'City(4)',
    district: 'Bairro(4)',
    description: 'Description(4)',
    social: [
      {
        name: 'Instagram',
        url: 'instagram.com',
      },
      {
        name: 'Facebook',
        url: 'facebook.com',
      },
    ],
  },
  {
    id: 5,
    name: 'Company(5)',
    city: 'City(5)',
    district: 'Bairro(5)',
    description: 'Description(5)',
    social: [
      {
        name: 'Instagram',
        url: 'instagram.com',
      },
      {
        name: 'Facebook',
        url: 'facebook.com',
      },
    ],
  },
];
