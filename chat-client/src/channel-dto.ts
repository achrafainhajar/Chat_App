export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
}

export interface CreateChannelDto {
    name: string;
    type: ChannelType;
    password?: string;
}
export interface UpdateChannelDto {
    name?: string;
    type?: ChannelType;
    password?: string;
}
