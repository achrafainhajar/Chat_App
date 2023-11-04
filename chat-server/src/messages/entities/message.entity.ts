import { ChannelType } from "../dto/channel-type.dto";

export class Message {
  name: string;
  text: string;
}

export enum MemberStatus {
  OWNER = 'Owner',
  ADMIN = 'Admin',
  MEMBER = 'Member',
}

export class Member {
  id: string;
  username: string;
  status: MemberStatus;
  mutedEndTime: Date;

  constructor(id: string, username: string, status: MemberStatus = MemberStatus.MEMBER,mutedEndTime:Date) {
    this.id = id;
    this.username = username;
    this.status = status;
    mutedEndTime = new Date();
  }
  setmutedEndTime(date:Date)
  {
      this.mutedEndTime = date;
  }
  getmutedEndTime():Date
  {
    return this.mutedEndTime
  }
}


export class Rooms {
  message: Message[] = [{ name: "", text: "" }];
  room_name: string;
  type: ChannelType;
  members: Member[] = [];
  banned:string[] = [];
  password?: string;
  constructor(name: string, type: ChannelType, password?: string) {
    this.room_name = name;
    this.type = type;
    if (password) this.password = password;
  }
  addMember(user: Member) {
    if(!this.members.find(member => user.id == member.id))
     this.members.push(user);
  }
  removeMember(memberId: string) {
    this.members = this.members.filter(member => member.id !== memberId);
  }
  getMembers()
  {
    if(this.members)
      return(this.members);
    else 
      return(null);
  }
  getMyMember(memberId:string):Member
  {
      const member = this.members.find((member) => (member.id === memberId))
      return(member);
  }
  getBanned()
  {
    return(this.banned);
  }
  setAdmin(memberId: string) {
    const member = this.members.find(m => m.id === memberId);
    if (member && member.status !== MemberStatus.OWNER) {
      member.status = MemberStatus.ADMIN;
    }
  }
  kickMember(memberId:string)
  {
    const member = this.members.filter(m => m.id !== memberId);
    this.members = member;
  }
  unsetAdmin(memberId: string) {
    const member = this.members.find(m => m.id === memberId);
    if (member && member.status !== MemberStatus.OWNER) {
      member.status = MemberStatus.MEMBER;
    }
  }
  banMember(memberId:string)
  {
    if(!this.banned.find((item) => item === memberId))
      this.banned.push(memberId);
  }
    muteMember(memberId, duration) {
    const muteEndTime = new Date(new Date().getTime() + duration * 60000); // duration in minutes
    const member = this.members.find(m => m.id === memberId);
    if(member)
    {
      member.setmutedEndTime(muteEndTime);
    }
    }
    isMemberMuted(memberId) {
      const member = this.members.find(m => m.id === memberId);
      if (member && new Date() < member.getmutedEndTime()) {
        return true;
      }
      return false;
    }
}