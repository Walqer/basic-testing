// Uncomment the code below and write your tests
import path, { join } from 'path';
import { doStuffByTimeout, doStuffByInterval, readFileAsynchronously } from '.';
import fs from 'fs';
import * as promise from 'fs/promises';
jest.mock('fs');
jest.mock('fs/promises');
describe('doStuffByTimeout', () => {
  const mockCallback = jest.fn();
  const timeout = 1000;
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockCallback, timeout);
    expect(setTimeout).toHaveBeenCalledWith(mockCallback, timeout);
  });

  test('should call callback only after timeout', () => {
    doStuffByTimeout(mockCallback, timeout);
    jest.advanceTimersByTime(500);
    expect(mockCallback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(500);
    expect(mockCallback).toHaveBeenCalled();
  });
});

describe('doStuffByInterval', () => {
  const mockCallback = jest.fn();
  const interval = 1000;
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    jest.clearAllTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockCallback, interval);
    expect(setInterval).toHaveBeenCalledWith(mockCallback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    doStuffByInterval(mockCallback, interval);
    jest.advanceTimersByTime(3000);
    expect(mockCallback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'file.txt';
  test('should call join with pathToFile', async () => {
    jest.spyOn(path, 'join');
    readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(expect.anything(), pathToFile);
  });
  test('should return null if file does not exist', async () => {
    expect(readFileAsynchronously(pathToFile)).resolves.toBeNull();
  });

  test('should return file content if file exists', async () => {
    const fileContent = 'Text in File';
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    (promise.readFile as jest.Mock).mockResolvedValueOnce(fileContent);
    const result = readFileAsynchronously(pathToFile);

    expect(result).resolves.toBe(fileContent); //
  });
});
