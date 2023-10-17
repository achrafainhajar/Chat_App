import '../assets/Usersbackground.css'
export interface Props
{
    children :  React.ReactNode;
}
const Usersbackground = ({children} : Props) => {
    return (
        <div className='usersb'>
            {children}
        </div>
    )
}

export default Usersbackground