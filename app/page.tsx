import  { UserButton }  from '@clerk/nextjs'; 

export default function Page() {
  return (  
    <div>
      <h1>Dashboard</h1>
      <UserButton afterSignOutUrl='/' />
      </div>
  );
}
