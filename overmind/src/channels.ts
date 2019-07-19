export interface Channel {
  id?: string;
  arbiterId: string;
  name: string;
  type: string;
  status: string;
  totemId: string;
}

class Channels {
  data: Channel[] = [];

  all(): Channel[] {
    return this.data;
  }

  id(arbiterId: string, name: string): string {
    return arbiterId + ":" + name;
  }

  findChannel(arbiterId: string, name: string): Channel | undefined {
    const id = this.id(arbiterId, name);
    return this.data.find(channel => channel.id === id);
  }

  addOrUpdateChannel(channel: Channel): Channel {
    let existingChannel = this.findChannel(channel.arbiterId, channel.name);
    if (existingChannel == null) {
      this.data.push(channel);
      existingChannel = channel;
      existingChannel.id = this.id(channel.arbiterId, channel.name);
    } else {
      existingChannel.type = channel.type;
      existingChannel.status = channel.status;
      existingChannel.totemId = channel.totemId;
    }

    return existingChannel;
  }
}

const channels = new Channels();

export default channels;
