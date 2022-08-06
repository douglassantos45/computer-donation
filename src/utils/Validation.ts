export function validation(data) {
  if (data.name === '') return false;
  if (data.phone === '') return false;
  if (data.zip === '') return false;
  if (data.city === '') return false;
  if (data.state === '') return false;
  if (data.streetAddress === '') return false;
  if (data.neighborhood === '') return false;

  return true;
}

const type = {
  PHONE: 'Telefone inválido. ',
  EMAIL: 'E-mail inválido. ',
  HEIGHBORHOOD: 'O bairro deve ter no mínimo 1 caracter. ',
  STREETADDRESS: 'O nome da rua está invalido. ',
  COMPLEMENT: 'O complemento deve ter no mínimo 2 caracteres. ',
  NUMBER: 'O número deve ser maior que 0',
};

export function messageError(requiredFields) {
  const message = requiredFields?.map(field => {
    return type[field.toUpperCase()];
  });

  return message;
}
