import {cookies} from "next/headers";
import {ChatLayout} from "@/components/chat/chat-layout";
import Link from "next/link";
import {redirect} from "next/navigation";

export default function Home() {
    const layout = cookies().get("react-resizable-panels:layout");
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    const authCookie = cookies().get("auth");

    if (!authCookie) {
        redirect("/login");
    }

    return (
        <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4">
            <div className="flex justify-between max-w-5xl w-full items-center">
                <Link href="#" className="text-4xl font-bold text-gradient">
                    Spring framework Chatting 플랫폼
                </Link>
            </div>

            <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
                <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8}/>
            </div>
        </main>
    );
}
