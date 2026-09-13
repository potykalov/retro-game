import Daemon from "../Daemon.js";

describe("Daemon", () => {
  it("should not throw error when creating instance", () => {
    expect(() => {
      new Daemon(1);
    }).not.toThrow();
  });

  it("should create instance with correct properties", () => {
    const received = {
      attack: 10,
      defence: 10,
      health: 50,
      level: 1,
      type: "daemon",
    };

    expect(new Daemon(1)).toEqual(received);
  });
});
