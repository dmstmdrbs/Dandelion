export const validateEmail = (email) => {
  const regex = /^[0-9?A-z0-9?]+(\.)?[0-9?A-z0-9?]+@[0-9?A-z]+\.[A-z]{2}.?[A-z]{0,3}$/;
  return regex.test(email);
};

export const validatePassword = (pass) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/;
  return regex.test(pass);
};

export const validateName = (name) => {
  const regex = /^[가-힣a-zA-Z0-9]{2,8}/i;
  return regex.test(name);
};

export const removeWhitespace = (text) => {
  const regex = /\s/g;
  return text.replace(regex, '');
};
