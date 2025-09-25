"use client";

import { use, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import getApi from "../lib/getApi";
import postApi from "../lib/postApi";
import NotFound from "@/not-found";
import DocumentTitle from '@uiw-admin/document-title';
// import DivisionDistricName from "@/app/divisions/DistrictDivision";

const limit = 6;

export default function CategoryPage({ params }) {
  const { catSlug } = use(params);

  const [category, setCategory] = useState(null);
  const [leadNewsList, setLeadNewsList] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [topContentIds, setTopContentIds] = useState([]);
  const [catID, setCatID] = useState(null);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // 🔹 Fetch category + initial news
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setInitialLoading(true);

        const CategoryList = await getApi(`category/${catSlug}`);
        const cat = CategoryList?.category;
        if (!cat) {
          setCategory(null);
          setInitialLoading(false);
          return;
        }

        setCategory(cat);
        setCatID(cat.CategoryID);

        const leadNews = await getApi(`inner-category-content/${cat.CategoryID}/10`);
        const leadList = leadNews?.inner_category_content || [];
        setLeadNewsList(leadList);

        const topIds = leadList.map((el) => el.ContentID) || [];
        setTopContentIds(topIds);

        const formData = {
          top_content_ids: topIds,
          category_id: cat.CategoryID,
          limit,
          offset: 0,
        };

        const newsResponse = await postApi("inner-category-content-more", formData);
        const newsData = newsResponse?.data || [];

        setNewsList(newsData);
        setOffset(newsData.length);
        setHasMore(newsData.length === limit);
      } catch (err) {
        console.error("Error fetching category:", err);
        setCategory(null);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchCategoryData();
  }, [catSlug]);

  // 🔹 Load More handler
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

  if (!initialLoading && !category) return <NotFound />;

  return (
    <>
      {/* 🔹 Client-side Metadata */}
      <DocumentTitle title={category?.CategoryName || "News Portal"}/>
      <Head>
        <title>{category?.CategoryName || "Category"}</title>
        <meta name="description" content={category?.CategoryName || "News Category"} />
        <meta name="keywords" content={category?.CategoryName || "News"} />
        <meta property="og:title" content={category?.CategoryName || "Category"} />
        <meta property="og:description" content={category?.CategoryName || "News"} />
        <meta
          property="og:image"
          content={
            category?.BannerImage
              ? `${process.env.NEXT_PUBLIC_IMG_PATH}${category.BannerImage}`
              : `${process.env.NEXT_PUBLIC_SITE_URL}/default-og.jpg`
          }
        />
      </Head>

      <div className="container">
        {/* 🔹 Category Title + Subcats */}
        <div className="row">
          <div className="col-lg-12 mt-3">
            <div className="CatTitle">
              <h1 className="text-center">{category?.CategoryName}</h1>
            </div>

            {catSlug === "country" ? (
              // <DivisionDistricName />
              ""
            ) : (
              category?.subCategories?.length > 0 && (
                <div className="col-12 mt-3">
                  <div className="subcat-nav d-flex flex-wrap justify-content-center gap-2">
                    {category.subCategories.map((subcat) => (
                      <Link
                        key={subcat.CategoryID}
                        href={`/${category.Slug}/${subcat.Slug}`}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        {subcat.CategoryName}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* 🔹 Initial Loading Skeleton */}
        {initialLoading ? (
          <div className="row">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div className="col-lg-6" key={idx}>
                <div className="card mb-3 mt-3">
                  <Skeleton height={250} width="100%" />
                  <div className="card-body">
                    <h5>
                      <Skeleton width="80%" height={20} />
                    </h5>
                    <p>
                      <Skeleton count={3} />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* 🔹 Lead News */}
            <div className="row">
              {leadNewsList.map((nc, idx) => (
                <div className="col-lg-6" key={idx}>
                  <Link href={`/details/${nc.Slug}/${nc.ContentID}`}>
                    <div className="card mb-3 mt-3">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}${nc.ImageBgPath}`}
                        alt={nc.DetailsHeading}
                        title={nc.DetailsHeading}
                        className="card-img-top img-fluid"
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

              {/* 🔹 More News */}
              {newsList.map((nc, idx) => (
                <div className="col-lg-6" key={idx}>
                  <Link href={`/details/${nc.Slug}/${nc.ContentID}`}>
                    <div className="card mb-3 mt-3">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMG_PATH}${nc.ImageBgPath}`}
                        alt={nc.DetailsHeading}
                        title={nc.DetailsHeading}
                        className="card-img-top img-fluid"
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

            {/* 🔹 Load More */}
            {hasMore && (
              <div className="col-12 text-center my-4 loadMorebtn">
                <button
                  className="btn btn-primary"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  {loading ? "লোড হচ্ছে..." : "আরো দেখুন"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
