export default function validation(data) {
  if (data.name == '') return false;
  if (data.phone == '') return false;
  if (data.zip == '') return false;
  if (data.city == '') return false;
  if (data.state == '') return false;
  if (data.streetAddress == '') return false;
  if (data.neighborhood == '') return false;

  return true;
}
