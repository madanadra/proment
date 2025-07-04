import Header from "../_components/header_auth"
import { Suspense } from "react";
import { get_index } from "@/fetch";
import { Index } from "@/type";
import CreateProject from "../_components/create_project";
import Link from "next/link";
import CardProject from "../_components/card_project";

export default async function DashboardPage() {
  const Load = () => {
    return (<>
      <div className="flex items-center gap-x-6 justify-between">
        <div className="bg-gray-200 animate-pulse w-1/4 h-8" />
        <div className="bg-gray-200 animate-pulse w-1/4 h-8" />
      </div>
      <div className="grid divide-y divide-gray-300">
        {Array(5).fill(1).map((_, i) => 
          <div key={i} className="grid gap-y-4 py-4">
            <div className="grid gap-y-1">
              <div className="bg-gray-200 animate-pulse w-full h-7" />
              <div className="bg-gray-200 animate-pulse w-1/2 h-5" />
            </div>
            <div className="sm:hidden bg-gray-200 animate-pulse w-full h-5" />
          </div>
        )}
      </div>
    </>)
  }

  const Main = async () => {
    const getIndex: {error: string} | {data: Index[]} = await get_index()

    if ("error" in getIndex) {
      return (
        <div className="grid place-content-center">
          <h1 className="text-lg font-medium">{getIndex.error}</h1>
        </div>
      )
    }

    return (<>
      <div className="flex items-center gap-x-6 justify-between">
        <div className="flex items-center gap-x-2">
          <h1>Project</h1>
          <h1 className="text-xs font-medium rounded-full bg-gray-200 py-1 px-2">{getIndex.data.length}</h1>
        </div>
        <CreateProject />
      </div>
      <div className="grid divide-y divide-gray-300">
        {getIndex.data.map(item => 
          <Link key={item.id} href={'/'+item.id}>
            <CardProject item={item} />
          </Link>
        )}
      </div>
    </>)
  }

  return (
    <div>
      <Header />
      <div className="grid gap-y-4 max-w-7xl p-4 mx-auto">
        <Suspense fallback={<Load />}>
          <Main />
        </Suspense>
      </div>
    </div>
  );
}
