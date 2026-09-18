import AsideNav from '@/components/aside/Nav';
import AsideProfile from '@/components/aside/Profile';
import { type Profession } from '@/utils/resume';

type NavItem = { type: string; title: string; children?: NavItem[] };

const LeftAside = ({ data, profession }: { data: NavItem[]; profession?: Profession }) => (
  <div className='sticky top-96 flex flex-col gap-y-32 pr-16 print:relative print:top-0 print:-mt-70 print:mb-20'>
    <AsideProfile profession={profession} />
    <AsideNav items={data} />
  </div>
);

export default LeftAside;
