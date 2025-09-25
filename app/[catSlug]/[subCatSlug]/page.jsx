"use client";

import getApi from "@/app/lib/getApi";
import postApi from "@/app/lib/postApi";
import NotFound from "@/not-found";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const limit = 6;

export default function SubCategoryPage() {
    const { catSlug, subCatSlug } = useParams();

    const [category, setCategory] = useState(null);
    const [subCategory, setSubCategory] = useState(null);
    const [leadNewsList, setLeadNewsList] = useState([]);
    const [newsList, setNewsList] = useState([]);
    const [topContentIds, setTopContentIds] = useState([]);
    const [catID, setCatID] = useState(null);

    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // ✅ Fetch subcategory + news
    useEffect(() => {
        async function fetchData() {
            try {
                setInitialLoading(true);

                const categoryRes = await getApi(`category/${catSlug}`);
                const subCatRes = await getApi(`sub-categorys/${catSlug}/${subCatSlug}`);

                const categoryData = categoryRes?.category;
                const subCatData = subCatRes?.subCategories;

                if (!categoryData || !subCatData) {
                    setCategory(null);
                    setSubCategory(null);
                    setInitialLoading(false);
                    return;
                }

                setCategory(categoryData);
                setSubCategory(subCatData);
                setCatID(categoryData.CategoryID);

                // ✅ Lead news
                const leadRes = await getApi(`inner-sub-category-content/${subCatData.CategoryID}/10`);
                const leadList = leadRes?.inner_subcategory_content || [];
                setLeadNewsList(leadList);

                const topIds = leadList.map((el) => el.ContentID);
                setTopContentIds(topIds);

                // ✅ More news
                const formData = {
                    top_content_ids: topIds,
                    category_id: categoryData.CategoryID,
                    limit,
                    offset: 0,
                };
                const moreRes = await postApi("inner-category-content-more", formData);
                const moreList = moreRes?.data || [];

                setNewsList(moreList);
                setOffset(moreList.length);
                setHasMore(moreList.length === limit);

                // ✅ Metadata updates (client-side)
                if (subCatData?.CategoryName) {
                    document.title = `${subCatData.CategoryName} - News Portal`;
                    updateMeta("description", subCatData.CategoryName);
                    updateMeta("keywords", subCatData.CategoryName);
                }
            } catch (err) {
                console.error("SubCategory fetch error:", err);
            } finally {
                setInitialLoading(false);
            }
        }

        fetchData();
    }, [catSlug, subCatSlug]);

    const updateMeta = (name, content) => {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
            meta.setAttribute("content", content);
        } else {
            const newMeta = document.createElement("meta");
            newMeta.name = name;
            newMeta.content = content;
            document.head.appendChild(newMeta);
        }
    };

    // ✅ Load More
    const handleLoadMore = async () => {
        setLoading(true);
        try {
            const formData = {
                top_content_ids: topContentIds,
                category_id: catID,
                limit,
                offset,
            };
            const res = await postApi("inner-category-content-more", formData);
            const newData = res?.data || [];

            setNewsList((prev) => [...prev, ...newData]);
            setOffset((prev) => prev + newData.length);

            if (newData.length < limit) setHasMore(false);
        } catch (err) {
            console.error("Load more error:", err);
        } finally {
            setLoading(false);
        }
    };


    if (!subCategory && !initialLoading) return <NotFound />;

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-12 mt-3">
                    <div className="CatTitle">
                        <h1 className="text-center">{subCategory?.CategoryName}</h1>
                    </div>

                </div>
            </div>

            {initialLoading ? (
                <div className="row">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div className="col-lg-6" key={`skeleton-${idx}`}>
                            <div className="card mb-3 mt-3">
                                <Skeleton height={250} width="100%" />
                                <div className="card-body">
                                    <h5><Skeleton width="80%" height={20} /></h5>
                                    <p><Skeleton count={3} /></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div className="row">
                        {leadNewsList.map((nc, idx) => (
                            <div className="col-lg-6" key={`lead-${idx}`}>
                                <Link href={`/details/${nc.Slug}/${nc.ContentID}`}>
                                    <div className="card mb-3 mt-3">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMG_PATH + nc.ImageBgPath}`}
                                            className="card-img-top img-fluid"
                                            alt={nc.DetailsHeading}
                                            title={nc.DetailsHeading}
                                            width={400}
                                            height={500}
                                        />
                                        <div className="card-body">
                                            <h5>{nc.DetailsHeading}</h5>
                                            <p>{nc.ContentBrief}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}

                        {newsList.map((nc, idx) => (
                            <div className="col-lg-6" key={`news-${idx}`}>
                                <Link href={`/details/${nc.Slug}/${nc.ContentID}`}>
                                    <div className="card mb-3 mt-3">
                                        <Image
                                            src={`${process.env.NEXT_PUBLIC_IMG_PATH + nc.ImageBgPath}`}
                                            className="card-img-top img-fluid"
                                            alt={nc.DetailsHeading}
                                            title={nc.DetailsHeading}
                                            width={400}
                                            height={500}
                                        />
                                        <div className="card-body">
                                            <h5>{nc.DetailsHeading}</h5>
                                            <p>{nc.ContentBrief}</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="col-12 text-center my-4 loadMorebtn">
                            <button className="btn btn-primary" onClick={handleLoadMore} disabled={loading}>
                                {loading ? "লোড হচ্ছে..." : "আরো দেখুন"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
