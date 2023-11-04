export enum ChannelRole {
    OWNER = 'owner',
    MEMBER = 'member',
    ADMIN = 'admin',
}

export class CreateChannelMemberDto {
    channel_id: string;
    user_id: string;
    role: ChannelRole;
}

export class UpdateChannelMemberDto {
    channel_id: string;
    user_id: string;
    role: ChannelRole;
}