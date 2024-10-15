import lodash from 'lodash';
import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let initialBalance: number;
  let account: ReturnType<typeof getBankAccount>;
  let secondAccount: ReturnType<typeof getBankAccount>;
  const balanceMock = 100;
  beforeEach(() => {
    initialBalance = 1000;
    account = getBankAccount(initialBalance);
    secondAccount = getBankAccount(initialBalance);
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(balanceMock)
      .mockReturnValueOnce(1);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(2000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => account.transfer(2000, secondAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(100, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    account.deposit(100);
    expect(account.getBalance()).toBe(1100);
  });

  test('should withdraw money', () => {
    account.withdraw(100);
    expect(account.getBalance()).toBe(900);
  });

  test('should transfer money', () => {
    account.transfer(100, secondAccount);
    expect(account.getBalance()).toBe(900);
    expect(secondAccount.getBalance()).toBe(1100);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    //first for balance; second for true statement in fetchBalance
    const balance = await account.fetchBalance();
    expect(balance).toBe(balanceMock);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest.spyOn(account, 'fetchBalance');
    await account.synchronizeBalance();
    expect(account.getBalance()).toBe(balanceMock);
    expect(account.fetchBalance).toHaveBeenCalled();
  });
  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
    expect(account.fetchBalance).toHaveBeenCalled();
  });
});
