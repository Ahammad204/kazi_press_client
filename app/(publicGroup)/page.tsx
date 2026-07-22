import { getMe } from "@/service/getMe";


export default async function Home() {
  const user = await getMe();
  return (
      <div>
        Hello World
      </div>
  );
}
