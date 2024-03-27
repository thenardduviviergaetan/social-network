"use client"
import { API_BASE_URL } from "@/app/lib/constants";
import { fetchGroupMembers, fetchPageNumber } from "@/app/lib/data";
import { Group, User } from "@/app/lib/definitions";
import { fetcher } from "@/app/lib/utils";
import Pagination from "@/app/ui/dashboard/pagination";
import Form from "@/app/ui/posts/create-form";
import Posts from "@/app/ui/posts/posts";
import useSWR from "swr";

export default function GroupDetails(
    {
        user,
        group,
        searchParams
    }: {
        user: User | null,
        group: Group,
        searchParams?: {
            page?: string;
            user?: string;
            id?: string;
        };
    }){      
        const currentPage = Number(searchParams?.page) || 1
        // const totalPages = await fetchPageNumber("/group/posts", `ID=${group.id}`)
        // const members = await fetchGroupMembers(String(group.id))
        const { data: totalPages } = useSWR(
            `${API_BASE_URL}/group/posts?ID=${group.id}`,
            fetcher
        )
        
        const { data: members } = useSWR(
            `${API_BASE_URL}/group/members?id=${group.id}`,
            fetcher,
            { revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 1000 },
        );

        const allowedMember = members?.some((m: User) => m.uuid === user?.uuid) 

    return (
        <div className="mt-8 p-5">
            { allowedMember &&
                <>  
                    <Form user={user?.uuid} group={group.id}/>
                    <Posts page={currentPage} urlSegment="/group/posts" user={user || undefined} group={group.id}/>
                    <Pagination totalPages={totalPages ?? 0}/>
                </>
            }
        </div>
    )
}