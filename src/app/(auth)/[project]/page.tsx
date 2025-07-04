import Header from "../../_components/header_auth"
import { Suspense } from "react";
import { get_detail } from "@/fetch";
import { Detail } from "@/type";
import CardProject from "@/app/_components/card_project";
import CreateTask from "@/app/_components/create_task";
import moment from "moment";
import UpdateStatus from "@/app/_components/update_status";

export default async function ProjectPage({params}: {params: Promise<{project: string}>}) {
  const Load = () => {
    return (<>
        <div className="grid gap-y-4 py-4">
            <div className="grid gap-y-1">
                <div className="bg-gray-200 animate-pulse w-full h-7" />
                <div className="bg-gray-200 animate-pulse w-1/2 h-5" />
            </div>
            <div className="sm:hidden bg-gray-200 animate-pulse w-full h-5" />
        </div>
        <div className="flex items-center gap-x-6 justify-between">
            <div className="bg-gray-200 animate-pulse w-1/4 h-8" />
            <div className="bg-gray-200 animate-pulse w-1/4 h-8" />
        </div>
        <div className="grid divide-y divide-gray-300">
            {Array(5).fill(1).map((_, i) => 
            <div key={i} className="grid gap-y-4 py-4">
                <div className="grid gap-y-1">
                    <div className="grid gap-y-4">
                        <div className="sm:hidden bg-gray-200 animate-pulse w-full h-5" />
                        <div className="bg-gray-200 animate-pulse w-full h-7" />
                    </div>
                    <div className="bg-gray-200 animate-pulse w-full h-5" />
                </div>
                <div className="grid gap-y-2">
                    <div className="bg-gray-200 animate-pulse w-1/4 h-4" />
                    <div className="bg-gray-200 animate-pulse w-full h-4" />
                </div>
            </div>
            )}
        </div>
    </>)
  }

  const Main = async () => {
    const {project} = await params
    const getDetail: {error: string} | {data: Detail} = await get_detail(project)

    if ("error" in getDetail) {
      return (
        <div className="grid place-content-center">
          <h1 className="text-lg font-medium">{getDetail.error}</h1>
        </div>
      )
    }

    return (<>
        <CardProject item={{...getDetail.data, taskCount: getDetail.data.task.length}} />
        <div className="flex items-center gap-x-6 justify-between">
            <div className="flex items-center gap-x-2">
              <h1>Your task</h1>
              <h1 className="text-xs font-medium rounded-full bg-gray-200 py-1 px-2">{getDetail.data.yourTaskCount}</h1>
            </div>
            <CreateTask id={getDetail.data.id} isOwner={getDetail.data.owner.id === getDetail.data.auth} />
        </div>
        <div className="grid divide-y divide-gray-300">
            {getDetail.data.task.map(item => 
                <div key={item.id} className="grid gap-y-4 py-4">
                    <div className="grid gap-y-1">
                        <div className="grid sm:flex sm:flex-row-reverse items-start gap-y-4 gap-x-8">
                            <div className="flex items-center justify-between gap-x-6 sm:mt-1">
                                <div className="flex items-center gap-x-2 py-0.5">
                                    <div className={`rounded-full w-4 aspect-square border-4
                                    ${item.status === 1 ? 'bg-gray-500 border-gray-200' : 
                                    item.status === 2 ? 'bg-amber-500 border-amber-200' : 
                                    'bg-emerald-500 border-emerald-200'}`} />
                                    <h1 className="text-nowrap text-xs font-semibold text-gray-500">
                                        {item.status === 1 ? 'Not started' : item.status === 2 ? 'Ongoing' : 'Done'}
                                    </h1>
                                    <h1 className="text-nowrap text-xs text-gray-500">{moment(item.updatedAt).fromNow()}</h1>
                                </div>
                                <UpdateStatus id={item.id} isOwner={getDetail.data.owner.id === getDetail.data.auth} status={item.status} />
                            </div>
                            <h1 className="grow text-lg font-medium">{item.title}</h1> 
                        </div>
                        <h1 className="text-sm">{item.description ? item.description : 'No description'}</h1>
                    </div>
                    <div className="grid gap-y-2">
                        <div className="flex items-center gap-x-2">
                            <h1 className="text-xs">Assignee</h1>
                            <h1 className="text-xs text-gray-500">{item.membership.length}</h1>
                        </div>
                        <h1 className="text-xs text-gray-500">
                            {item.membership.map((membership, i) => 
                                <span key={i} className={membership.user.id === getDetail.data.auth ? 'text-indigo-700' : ''}>
                                    {membership.user.username+(item.membership.length === i+1 ? '' : ', ')}
                                </span>
                            )}
                        </h1>
                    </div>
                </div>
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
