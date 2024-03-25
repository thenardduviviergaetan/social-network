import { fetchGroup } from "@/app/lib/data"

export default async function GroupPage({ ID }: {ID: string}) {
    const group = await fetchGroup(ID)

    console.log(group);
    
    return (
        <>
            <h1 className="size-40">{group?.name}</h1>
            {/* TODO Add delete button */}
            {/* TODO Add Update button */}
            {/*  */}
        </>
    )
}