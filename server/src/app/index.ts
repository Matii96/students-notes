import * as config from '../../config';
import Service from './Service';

let app: Service;
if (process.argv.length > 2) {
  app = new (require('./Command').default)(config);
} else {
  app = new (require('./Service').default)(config);
}
export default app;

// Launch app
app.Init();
