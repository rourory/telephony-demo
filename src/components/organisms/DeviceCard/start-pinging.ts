type StartPingingFunctionType = (
  ipAddress: string,
  intervalMS: number,
  callback: (alive: any) => void
) => () => void;

/**
 *
 * @param ipAddress address of machine which is going to be pinged
 * @param intervalMS how often machine has to be pinged
 * @param callback what needs to do after machine is pinged
 * @returns function wich clears the interval and unsubscribes of ipcMain messages
 */
const startPinging: StartPingingFunctionType = (
  ipAddress,
  intervalMS,
  callback
) => {
  const interval = setInterval(() => {
    console.log(`pinging ${ipAddress}`);
    // window.electron.ipcRenderer.sendMessage(`remote.ping`, ipAddress);
  }, intervalMS);
  // const unsubscribe = window.electron.ipcRenderer.on(
  //   `remote.ping.${ipAddress}`,
  //   (alive: any) => {
  //     callback(alive);
  //   }
  // );
  // window.electron.ipcRenderer.sendMessage(`remote.ping`, ipAddress);
  return () => {
    // unsubscribe();
    clearInterval(interval);
  };
};

export default startPinging;
