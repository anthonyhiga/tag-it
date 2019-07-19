export interface Command {
  id?: number;
  arbiterId: string;
  status: string;
  message: string;
  response?: string;
}

class Commands {
  data: Command[] = [];

  genId() {
    const min = Math.ceil(0);
    const max = Math.floor(2147483646);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  clean() {
    this.data = this.data.filter(
      command => command.status !== "COMPLETE" && command.status != "FAILED"
    );
  }

  add(command: Command) {
    command.id = this.genId();
    this.data.push(command);
  }

  find(id: number) {
    return this.data.find(command => command.id == id);
  }

  findActiveCommands(arbiterId: string) {
    return this.data.filter(
      command =>
        (command.status === "START" || command.status === "RUNNING") &&
        command.arbiterId === arbiterId
    );
  }

  all(): Command[] {
    return this.data;
  }
}

const commands = new Commands();

export default commands;
