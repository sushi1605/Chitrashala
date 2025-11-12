import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import ClientLayout from "../clientLayout";

export default async function BlogLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();

	if (!session) redirect("/login");

	return (
		<div className="min-h-screen dark:bg-black bg-white">
			<ClientLayout>{children}</ClientLayout>
		</div>
	);
}
