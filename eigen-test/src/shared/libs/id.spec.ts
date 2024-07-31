import { generateMemberCode } from './id';

describe('Lib Id', () => {
  it('should be defined', () => {
    expect(generateMemberCode).toBeDefined();
  });

  it('should return correct member code pattern', () => {
    const code = generateMemberCode();
    expect(code[0]).toEqual('M');
    expect(code.length).toEqual(11);
  });
});
