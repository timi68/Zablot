export default function validatePhoneNumber(phoneNumber: string) {
  const nigeriaPhoneNumberRegex = /^(?:\+?234|0)?[789]\d{9}$/;
  return nigeriaPhoneNumberRegex.test(phoneNumber);
}
