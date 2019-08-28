import * as grpc from "grpc";
import { Logger } from "../Logger/index";
import * as path from 'path';
class GRPCServer {
  private _ip: string;
  private _port: number;
  private _Server;
  private _Logger: Logger;
  private _NoteProtos;

  constructor(ip: string, port: number) {
    this._ip = ip;
    this._port = port;
    this._Server = new grpc.Server();
    this._Logger = new Logger();
  }
  public start(): void {
    this._Server.bind(
      `${this._ip}:${this._port}`,
      grpc.ServerCredentials.createInsecure()
    );
    try {
      this.loadProtosFiles();
      this.addService();
      this._Server.start();
      this._Logger.info(`GRPC Server started @ ${this._ip}:${this._port}`);
      this._Logger.debug(`GRPC Server started @ ${this._ip}:${this._port}`);
      this._Logger.error(`GRPC Server started @ ${this._ip}:${this._port}`);
    } catch (e) {
      this._Logger.error("Failed to start GRPC Server reason @", e);
    }
  }
  private loadProtosFiles() {
    this._NoteProtos = grpc.load(path.join(__dirname,"../ProtoBuffers/notes.proto"));
  }

  private addService() {
    var _this = this;
    const notes = [
      { id: "1", title: "Note 1", content: "Content 1" },
      { id: "2", title: "Note 2", content: "Content 2" }
    ];

    this._Server.addService(this._NoteProtos.NoteService.service, {
      List: (_: any, callback: Function) => {
        callback(null, notes);
      },
      AddNote: (_:any, callback: Function) => {
        notes.push(_.request);
        callback(null,notes);
      }
    });
  }
}

function main() {
  var server = new GRPCServer("0.0.0.0", 51001);
  server.start();
}

main();
