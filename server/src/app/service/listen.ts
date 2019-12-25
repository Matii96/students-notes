import { networkInterfaces, NetworkInterfaceInfo } from 'os';
import Service from '.';

function Listen(this: Service): void {
  this.server.listen(this.config.port, (): void => {
    // Show info about running server
    const addresses: string[] = [`localhost`];
    const ifaces = networkInterfaces();
    Object.keys(ifaces).forEach((ifname: string): void => {
      ifaces[ifname].forEach((iface: NetworkInterfaceInfo): void => {
        // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        if (iface.family !== 'IPv4' || iface.internal !== false) {
          return;
        }
        addresses.push(iface.address);
      });
    });
    this.logger.info(
      `Listening in ${process.env.NODE_ENV} mode at:\n${addresses
        .map((address: string): string => `${this.config.protocol}://${address}:${this.config.port}`)
        .join('\n')}`
    );
  });
}
export default Listen;
