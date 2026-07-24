import { Suspense } from "react";
import { NewsSearchBar } from "../_components/news/NewsSearchBar";
import { NewsSkeleton } from "../_components/news/NewsSkeleton";
import { PublicNewsList } from "../_components/news/PublicNewsList";
import { Pagination } from "../_components/news/Pagination";

const NewsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const query = await searchParams;
  const page = query?.page ? Number(query.page) : 1;
  const limit = 6;

  // We need to fetch meta separately for pagination
  // The PublicNewsList already fetches data, so we pass meta info here
  const params = new URLSearchParams();
  if (query?.searchTerm) {
    params.set("searchTerm", query.searchTerm as string);
  }
  params.set("page", page.toString());
  params.set("limit", limit.toString());

  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/posts?${params.toString()}`,
    { cache: "no-cache" }
  );
  const result = await res.json();
  const totalPages = result.meta?.totalPages ?? 1;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">News</h1>
          <p className="text-sm text-muted-foreground">
            Browse the latest published stories.
          </p>
        </div>

        <NewsSearchBar />
      </div>

      <Suspense fallback={<NewsSkeleton />}>
        <PublicNewsList searchParams={searchParams} />
      </Suspense>

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
};

export default NewsPage;