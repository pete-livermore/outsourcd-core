export class MockCardDesignModel {
  find = jest.fn().mockReturnValue({ exec: jest.fn() });
}
