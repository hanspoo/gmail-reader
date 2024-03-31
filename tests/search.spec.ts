import { Mailer } from "../src/Mailer";
jest.mock("../src/Mailer"); // Mailer is now a mock constructor

const mockedMailer = <jest.Mock<Mailer>>Mailer;
process.env["DEBUG"] = "1";

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockedMailer.mockClear();
  // const mockedDependency = <jest.Mock<typeof Mailer>>Mailer;
});

it("We can check if the consumer called a method on the class instance", async () => {
  // Show that mockClear() is working:
  expect(Mailer).not.toHaveBeenCalled();

  const mailer = new Mailer(process.env["USER"] || "", true);
  // Constructor should have been called again:
  expect(Mailer).toHaveBeenCalledTimes(1);

  // const coolSoundFileName = "song.mp3";
  const x = await mailer.find("", "", 10);

  // mock.instances is available with automatic mocks:
  const mockMailerInstance = mockedMailer.mock.instances[0];
  const mockPlaySoundFile = mockMailerInstance.find as any;
  expect(mockPlaySoundFile.mock.calls[0][0]).toBe(10);
  // // Equivalent to above check:
  // expect(mockPlaySoundFile).toHaveBeenCalledWith(coolSoundFileName);
  // expect(mockPlaySoundFile).toHaveBeenCalledTimes(1);
});
