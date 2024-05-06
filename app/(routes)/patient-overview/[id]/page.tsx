import { getAccessToken } from '@/app/api/login-api/accessToken';
import { redirect } from 'next/navigation';

const page = () => {
  if (!getAccessToken()) {
    redirect("/login");
  }
  return (
    <div>page</div>
  )
}


export default page

