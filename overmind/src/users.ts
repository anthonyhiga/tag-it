const faker = require("faker");
import { User } from "./base-types";

import USERS from "./default-users";

class Users {
  data: User[] = [];

  genId() {
    const min = Math.ceil(100000);
    const max = Math.floor(2147483646);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  genTotemId() {
    const min = Math.ceil(1000000);
    const max = Math.floor(10000000);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  all(): User[] {
    return this.data;
  }

  id(arbiterId: string, name: string): string {
    return arbiterId + ":" + name;
  }

  get(userId: number): User | null {
    for (const id in this.data) {
      const user = this.data[id];
      if (user.id == userId) {
        return user;
      }
    }
    return null;
  }

  getUserByTotemId(totemId: number) {
    for (const id in this.data) {
      const user = this.data[id];
      if (user.totemId == totemId) {
        return user;
      }
    }
    return null;
  }

  createUser(totemId: number): User {
    const user: User = USERS[totemId] || {
      id: this.genId(),
      totemId: totemId != null ? totemId : this.genTotemId(),
      name: faker.name.findName(),
      iconUrl: faker.image.imageUrl(),
      avatarUrl: faker.internet.avatar()
    };

    console.log("ADDING NEW USER: " + user.id + " TOTEM: " + totemId);
    this.data.push(user);
    return user;
  }
}

const users = new Users();

export default users;
