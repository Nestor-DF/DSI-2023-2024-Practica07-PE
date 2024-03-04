import "mocha";
import { expect } from "chai";
import { Logger } from "../src/Logger";

const logger = Logger.getInstance();
const date = new Date();

describe("Logger", () => {
  it("should add log entry correctly", () => {
    logger.addLog("user1", "login", date);

    expect(logger.getLogs()).to.deep.equal([["user1", "login", date]]);
  });

  it("should get logs by user correctly", () => {
    logger.addLog("user2", "login", date);
    logger.addLog("user2", "logout", date);

    expect(logger.getLogByUser("user1")).to.deep.equal([["user1", "login", date]]);
    expect(logger.getLogByUser("user2")).to.deep.equal([
      ["user2", "login", date],
      ["user2", "logout", date],
    ]);
  });

  it("should get login actions correctly", () => {
    logger.addLog("user3", "login", date);

    expect(logger.getLogsByAction("login")).to.deep.equal([
      ["user1", "login", date],
      ["user2", "login", date],
      ["user3", "login", date],
    ]);
  });

  it("should get logout actions correctly", () => {
    expect(logger.getLogsByAction("logout")).to.deep.equal([["user2", "logout", date]]);
  });

  it("should get actions between dates correctly", () => {
    const date_aux1 = new Date("August 19, 1975 23:15:30");
    logger.addLog("user4", "login", date_aux1);

    const date_aux2 = new Date("August 25, 1975 23:15:30");
    logger.addLog("user5", "login", date_aux2);

    const date_aux3 = new Date("August 28, 1975 23:15:30");
    logger.addLog("user6", "login", date_aux3);

    const actionsBetweenDates = logger.getLogsBetweenDates(date_aux1, date_aux3);
    expect(actionsBetweenDates).to.deep.equal([
      ["user4", "login", date_aux1],
      ["user5", "login", date_aux2],
      ["user6", "login", date_aux3],
    ]);
  });

  it("should be iterable", () => {
    for (const log of logger) {
      console.log(log);
    }
  });
});
