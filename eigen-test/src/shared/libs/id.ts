import { customAlphabet } from 'nanoid';

export const generateMemberCode = () => {
  const nanoid = customAlphabet('1234567890ASDFGHJKLQWERTYUIOPZXCVBNM', 10);
  return `M${nanoid()}`;
};

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateBookCode = () => {
  const nanoid = customAlphabet('1234567890ASDFGHJKLQWERTYUIOPZXCVBNM', 10);

  const prefixid = customAlphabet(
    'QWERTYUIOPASDFGHJKLZXCVBNM',
    getRandomInteger(2, 5),
  );

  return `${prefixid()}-${nanoid()}`;
};
