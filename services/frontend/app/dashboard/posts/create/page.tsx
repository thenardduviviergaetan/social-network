import Form from '@/app/ui/posts/create-form';
import { auth } from '@/auth';

export default async function Page() {
    const session = await auth()
    return (
        <>
            <Form user={session?.user?.uuid}/>
        </>
    )
}