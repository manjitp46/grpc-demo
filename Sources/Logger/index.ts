// const Config = require("../Config");
/**
 * using console based logger since PM2
 * logs every thing inside a file
 * those configurations can be manged with pm2 config
 */

import * as path from 'path';

// import { ServerConfigs } from "../Config/ServerConfigs";
//  chalk have bug not able to use with import statement
const colors = require("colors");
const stackTrace = require('stack-trace');



export class Logger {
  NODE_ENV: string = process.env["NODE_ENV"] || "dev";
  info(...msg: any[]) {
    var input = this.getCaller();
    console.info(
      colors.green(this.getDateTimeInstance()),
      colors.green("-"),
      colors.green("[INFO]:"),
      colors.green(`[${input.replace(/\//g,".").substring(2)}]`),
      colors.green(...msg)
    );
  }
  debug(...msg: any[]) {
    var input = this.getCaller();
    console.debug(
      colors.cyan(this.getDateTimeInstance()),
      colors.cyan("-"),
      colors.cyan("[DEBUG]:"),
      colors.cyan(`[${input.replace(/\//g,".").substring(2)}]`),
      colors.cyan(...msg)
    );
  }
  error(...msg: any[]) {
    var input = this.getCaller();
    console.error(
      colors.red(this.getDateTimeInstance()),
      colors.red("-"),
      colors.red("[ERROR]:"),
      colors.red(`[${input.replace(/\//g,".").substring(2)}]`),
      colors.red(...msg)
    );
  }
  warn(...msg: any[]) {
    console.warn(this.getDateTimeInstance(), "-", "WARN:", ...msg);
  }
  getDateTimeInstance() {
    return this.calcTime(
      '5.5',
      'local'
    );
  }

  getCaller() {
    const trace = stackTrace.get();
    const root = path.dirname(__dirname);
    return `.${trace[2]
      .getFileName()
      .substring(root.length)}:${trace[2].getLineNumber()}`;
  }

  calcTime(offset, format) {
    // create Date object for current location
    var d = new Date();

    // convert to msec
    // subtract local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + d.getTimezoneOffset() * 60000;

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + 3600000 * offset);

    // return time as a string
    switch (format) {
      case "local":
        return nd.toLocaleString();
      case "iso":
        return nd.toISOString();
      default:
        return nd.toTimeString();
    }
  }
}