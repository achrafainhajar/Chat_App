export enum ChannelType {
    PUBLIC = 'public',
    PRIVATE = 'private',
    PROTECTED = 'protected',
}

export class CreateChannelDto {
    name: string;
    type: ChannelType;
    password?: string;
}
export class UpdateChannelDto {
    name?: string;
    type?: ChannelType;
    password?: string;
}


export class Props
{
    name:string;
    room:CreateChannelDto;
}