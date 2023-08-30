import { Activities, Users } from "@models/index";

export function Cleanup() {
  /**
   * @param {{ cleanup: any; exit: any; }} options
   * @param {number} exitCode
   */
  async function exitHandler(options: any, exitCode: number) {
    console.log({ arguments, options, exitCode, Activities, Users });
    if (options.exit) {
      await Activities.deleteMany({});
      await Users.updateMany({ online: true }, { online: false });
    }
    process.exit(exitCode ?? 1);
  }

  //do something when app is closing
  process.on("exit", exitHandler.bind(null, { exit: true }, 1));

  // catch ctrl+c event and exit normally
  process.on("SIGINT", exitHandler.bind(null, { exit: false }, 2));

  //catch uncaught exceptions, trace, then exit normally
  process.on("uncaughtException", function (e) {
    console.log("Uncaught Exception...");
    console.log({ stack: e.stack });
    process.exit(99);
  });
}
