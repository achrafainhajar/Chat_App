import { useState } from 'react';
import "../assets/MembersList.css"
import { Member, MemberStatus } from '../App';
import { Socket } from 'socket.io-client';
import { CreateChannelDto } from '../channel-dto';

interface Props {
    members: Member[] | null;
    socket : Socket | null;
    room:CreateChannelDto;
    me:Member | null;
}

const ShowMembers = ({ me ,members ,socket,room}: Props) => {
    const [show, setShow] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    const handleMemberClick = (member: Member) => {
        if (selectedMember === member) {
            setSelectedMember(null);
        } else {
            setSelectedMember(member);
        }
    };
    const handleSet= (socket:Socket | null,id:string,room:string) => {
        if(socket)
        {
            socket.emit("setAdmin",{memberId:id,roomName:room});
        }
    }
    const handleUnset = (socket:Socket | null,id:string,room:string) => {
        if(socket)
        {
            socket.emit("unsetAdmin",{memberId:id,roomName:room});
        }
    }
    const handleKick = (socket:Socket | null,id:string,room:string) => {
        if(socket)
        {
            socket.emit("Kick",{memberId:id,roomName:room});
        }
    }
    const handleBan = (socket:Socket | null,id:string,room:string) => {
        if(socket)
        {
            handleKick(socket,id,room);
            socket.emit("Ban",{memberId:id,roomName:room});
        }
    }
    const handleMute = (socket:Socket | null,id:string,room:string) => {
        if(socket)
        {
            socket.emit("Mute",{memberId:id,roomName:room});
        }
    }
    return (
        <div className='member'>
            <button onClick={() => setShow(!show)}>
                {show ? 'Hide Members' : 'Show Members'}
            </button>
            {show && (
                <ul>
                    {members?.map((member) => (
                        <li 
                            key={member.id} 
                            onClick={() => {handleMemberClick(member);console.log(me)}}
                            className={selectedMember === member ? 'highlighted' : 'solid'}
                        >
                            <div>{member.username}::{member.status}</div>
                            {selectedMember === member && me && me != member && me.status !== MemberStatus.MEMBER && member.status !== MemberStatus.OWNER && (
                                <div className='buttons-container'>{((me.status === MemberStatus.OWNER || (me.status === MemberStatus.ADMIN && member.status !== MemberStatus.ADMIN)) )&&
                                    <>
                                    <button onClick={() => {handleMute(socket,member.id,room.name)}}className='memberx'>MUTE</button>
                                    <button onClick={() => {handleKick(socket,member.id,room.name)}}className='memberx'>KICK</button>
                                    <button onClick={() => {handleBan(socket,member.id,room.name)}} className='memberx'>BAN</button>
                                    </>
                                }
                                    {member.status === MemberStatus.ADMIN && me.status === MemberStatus.OWNER && <button className='memberxd' onClick={()=>{handleUnset(socket,member.id,room.name)}}>UNSET ADMIN</button>}
                                    {member.status != MemberStatus.ADMIN && me.status === MemberStatus.OWNER && <button className='memberxd' onClick={()=>{handleSet(socket,member.id,room.name)}}>SET ADMIN</button>}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default ShowMembers;
