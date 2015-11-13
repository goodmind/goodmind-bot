import 'source-map-support/register';

import Logger from './lib/utils/logger';
import BootLogger from './lib/utils/boot_logger';
import Bot from './bot/bot';

import Application from './lib/application';

var app = new Application(BootLogger, Logger, Bot);
    app.promise.then(app.bootLogger.ok).catch(app.errorHandler);