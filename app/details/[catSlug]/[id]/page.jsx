import Image from "next/image";
import Link from "next/link";
// import SocialShare from "./SocialShare";
import { FaTag } from "react-icons/fa";
import getApi from "@/app/lib/getApi";
import SocialShare from "./SocialShare";

// function formatDateTime(date) {
//     return new Date(date).toLocaleString("en-GB", {
//         day: "numeric",
//         month: "numeric",
//         year: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//     });
// }

// ✅ Revalidate every 60s
export const revalidate = 60;

// ✅ Metadata
export async function generateMetadata({ params }) {
    const { id } = await params;
    const response = await getApi(`content-details/${id}`);
    const data = response?.data || [];
    const firstContentItem = data[0];

    if (!firstContentItem) {
        return {
            title: "NewsPortal - Details",
            description: "Read full news on NewsPortal.",
        };
    }

    return {
        title: firstContentItem.DetailsHeading || "Details - NewsPortal",
        description: firstContentItem.DetailsHeading || "Read full news on NewsPortal.",
        openGraph: {
            title: firstContentItem.DetailsHeading || "NewsPortal News",
            description: firstContentItem.DetailsHeading || "NewsPortal - Trusted News",
            type: "article",
            url: `https://deshkalnews.com/details/${firstContentItem?.CategorySlug}/${firstContentItem?.ContentID}`,
            images: [
                `https://assets.deshkalnews.com/${firstContentItem?.ImageSmPath}`,
            ],
        },
    };
}

// ✅ Page (Server Component only)
export default async function NewsDetailsPage({ params }) {
    const { id } = await params;
    // Fetch content details
    const response = await getApi(`content-details/${id}`);
    const data = response?.data || [];

    if (!data || data.length === 0) {
        return <div className="container mt-4">News not found.</div>;
    }

    const firstContentItem = data[0];

    const catID = firstContentItem.CategoryID;
    const catName = firstContentItem.CategoryName;

    // Fetch sidebar data
    const [latestRes, popularRes] = await Promise.all([
        getApi(`category-latest-content/${catID}/4`),
        getApi(`category-popular-content/${catID}/4`),
    ]);

    const latestNews = latestRes?.data || [];
    const popularNews = popularRes?.data?.slice(0, 4) || [];
    // const generatedAt = formatDateTime(new Date());

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <div className="newsDetail">
                        <h1 className="text-2xl font-bold mb-2">{firstContentItem.DetailsHeading}</h1>
                        <p className="text-sm text-gray-500 mb-3">
                            {/* {formatDateTime(firstContentItem.PublishDate)} */}
                            প্রকাশিত: {new Date(firstContentItem.created_at).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        {/* Social Share */}
                        <SocialShare
                            url={`${process.env.NEXT_PUBLIC_IMG_PATH}/${firstContentItem.CategorySlug}/${firstContentItem.ContentID}`}
                            title={firstContentItem.DetailsHeading}
                        />

                        {/* News Image */}
                        {firstContentItem.ImageBgPath && (
                            <Image
                                src={`${process.env.NEXT_PUBLIC_IMG_PATH + firstContentItem.ImageBgPath}`}
                                alt={firstContentItem.DetailsHeading || "News image"}
                                width={800}
                                height={450}
                                className="img-fluid mb-3 rounded"
                            />
                        )}

                        {/* News Body */}
                        <div
                            className="Content-Details" style={{ marginTop: "20px" }}
                            dangerouslySetInnerHTML={{ __html: firstContentItem.ContentDetails }}
                        />


                        {/* Tags */}
                        {firstContentItem.Tags && firstContentItem.Tags.length > 0 && (
                            <div className="RelatedTags d-print-none">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <p className="Subject"><FaTag /> সম্পর্কিত বিষয়: </p>
                                        {firstContentItem.Tags.split(",").map(tag => (
                                            <div className="TagList" key={tag}>
                                                <Link href={`/tags/${tag}`}><p>{tag}</p></Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Sidebar */}

                </div>
                <div className="col-md-4 col-12">
                    {/* Latest News */}
                    <div className="mb-6">
                        <div className="latest-sidebar">
                            <h4 className="mb-3 mt-5">{catName} এর সর্বশেষ খবর</h4>
                            {latestNews.map(item => (
                                <Link href={`/details/${item.Slug}/${item.ContentID}`} key={item.ContentID}>
                                    <div className="row mb-3">
                                        <div className="col-lg-5 col-5">
                                            <Image src={`${process.env.NEXT_PUBLIC_IMG_PATH + item.ImageSmPath}`} width={120} height={80} style={{ width: "100%", height: "auto", objectFit: "cover" }} alt={item.DetailsHeading} />
                                        </div>
                                        <div className="col-lg-7 col-7">{item.DetailsHeading.length > 60 ? item.DetailsHeading.slice(0, 40) + "..." : item.DetailsHeading}</div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                    </div>

                    {/* Popular News */}
                    <div className="latest-sidebar">
                        <h4 className="mb-3 mt-5">{catName} এর জনপ্রিয় খবর</h4>
                        {popularNews.map(item => (
                            <Link href={`/details/${item.Slug}/${item.ContentID}`} key={item.ContentID}>
                                <div className="row mb-3">
                                    <div className="col-lg-5 col-5">
                                        <Image src={`${process.env.NEXT_PUBLIC_IMG_PATH + item.ImageSmPath}`} width={120} height={80} style={{ width: "100%", height: "auto", objectFit: "cover" }} alt={item.DetailsHeading} />
                                    </div>
                                    <div className="col-lg-7 col-7">{item.DetailsHeading.length > 60 ? item.DetailsHeading.slice(0, 40) + "..." : item.DetailsHeading}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
