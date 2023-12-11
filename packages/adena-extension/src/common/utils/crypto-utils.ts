import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

const ENCRYPT_CIPHER_KEY = 'r3v4';

export const encryptSha256Password = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const encryptPassword = (
  password: string,
): { encryptedKey: string; encryptedPassword: string } => {
  const cryptKey = uuidv4();
  const adenaKey = ENCRYPT_CIPHER_KEY;
  const encryptedKey = CryptoJS.AES.encrypt(cryptKey, adenaKey).toString();
  const encryptedPassword = CryptoJS.AES.encrypt(password, cryptKey).toString();
  return {
    encryptedKey,
    encryptedPassword,
  };
};

export const decryptPassword = (encryptedKey: string, encryptedPassword: string): string => {
  const adenaKey = ENCRYPT_CIPHER_KEY;
  const key = CryptoJS.AES.decrypt(encryptedKey, adenaKey).toString(CryptoJS.enc.Utf8);
  if (key === '') {
    throw new Error('CipherKey Decryption Failed');
  }
  const password = CryptoJS.AES.decrypt(encryptedPassword, key).toString(CryptoJS.enc.Utf8);
  if (password === '') {
    throw new Error('Password Decryption Failed');
  }
  return password;
};
