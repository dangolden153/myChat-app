import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum MessageStatus {
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  READ = "READ"
}



type ChatroomMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type MessageMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type ChatroomUserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

type UserMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Chatroom {
  readonly id: string;
  readonly newMessages?: number;
  readonly lastlMessage?: Message;
  readonly Messages?: (Message | null)[];
  readonly ChatroomUsers?: (ChatroomUser | null)[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Chatroom, ChatroomMetaData>);
  static copyOf(source: Chatroom, mutator: (draft: MutableModel<Chatroom, ChatroomMetaData>) => MutableModel<Chatroom, ChatroomMetaData> | void): Chatroom;
}

export declare class Message {
  readonly id: string;
  readonly content?: string;
  readonly userID?: string;
  readonly chatroomID?: string;
  readonly audio?: string;
  readonly image?: string;
  readonly status?: MessageStatus | keyof typeof MessageStatus;
  readonly replyToMessage?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<Message, MessageMetaData>);
  static copyOf(source: Message, mutator: (draft: MutableModel<Message, MessageMetaData>) => MutableModel<Message, MessageMetaData> | void): Message;
}

export declare class ChatroomUser {
  readonly id: string;
  readonly chatroom: Chatroom;
  readonly user: User;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<ChatroomUser, ChatroomUserMetaData>);
  static copyOf(source: ChatroomUser, mutator: (draft: MutableModel<ChatroomUser, ChatroomUserMetaData>) => MutableModel<ChatroomUser, ChatroomUserMetaData> | void): ChatroomUser;
}

export declare class User {
  readonly id: string;
  readonly name: string;
  readonly imageUri?: string;
  readonly status?: string;
  readonly Messages?: (Message | null)[];
  readonly chatrooms?: (ChatroomUser | null)[];
  readonly lastOnlineAt?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  constructor(init: ModelInit<User, UserMetaData>);
  static copyOf(source: User, mutator: (draft: MutableModel<User, UserMetaData>) => MutableModel<User, UserMetaData> | void): User;
}