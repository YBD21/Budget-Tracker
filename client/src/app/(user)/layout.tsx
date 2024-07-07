import NavBar from '@/components/NavBar';

type Props = { children: React.ReactNode };
const UserLayout = ({ children }: Props) => {
  return <NavBar> {children} </NavBar>;
};

export default UserLayout;
