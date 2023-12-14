import { faker } from "@faker-js/faker";
import { proxy } from "valtio";
import type { Message } from "./Message";

const creators = {
  withImage: () => ({
    id: faker.string.alphanumeric(15),
    senderName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    body: faker.lorem.paragraph(),
    attachmentImage: faker.image.url(),
  }),
  noImage: () => ({
    id: faker.string.alphanumeric(15),
    senderName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    body: faker.lorem.paragraph(),
  }),
} as const;

export type CreatorType = keyof typeof creators;
export const creatorTypes = Object.keys(creators);

export function creatorType(val: string): CreatorType {
  if (creatorTypes.includes(val)) return val as CreatorType;
  throw new Error("Unexpected type " + val);
}

function randomMessages(count: number = 10): Message[] {
  return new Array(count).fill(0).map(() => {
    const typeToCreate = creatorType(
      creatorTypes[Math.floor(Math.random() * creatorTypes.length)]
    );
    return creators[typeToCreate]();
  });
}

export const store = proxy({
  debug: undefined as undefined | JSON,

  messages: randomMessages(10),
  typeToCreate: "withImage" as CreatorType,
  addToTop(n = 1) {
    for (let i = 0; i < n; i++)
      this.messages.unshift(creators[this.typeToCreate]());
  },
  addToBottom(n = 1) {
    for (let i = 0; i < n; i++)
      this.messages.push(creators[this.typeToCreate]());
  },
  setType(newType: CreatorType) {
    this.typeToCreate = newType;
  },
});
