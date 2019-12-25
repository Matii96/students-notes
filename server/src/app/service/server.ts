import * as fs from 'fs';
import * as path from 'path';
import * as Http from 'http';
import * as Https from 'https';
import Service from '.';

async function ServerInitializer(this: Service): Promise<Http.Server | Https.Server> {
  if (this.config.protocol !== 'https') {
    return Http.createServer(this.express);
  }

  // Set ssl certificate
  const sslDir: string = path.resolve(this.rootdir, 'config', 'ssl');
  const credentials = {
    key: fs.readFileSync(path.join(sslDir, 'server.key'), 'utf8'),
    cert: fs.readFileSync(path.join(sslDir, 'server.cer'), 'utf8')
  };

  // Create server instance
  return Https.createServer(credentials, this.express);
}
export default ServerInitializer;
