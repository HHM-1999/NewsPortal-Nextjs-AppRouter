"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import postApi from "../lib/postApi";
import getApi from "../lib/getApi";

 
export default function ArchivePage() {
  const [archivedata, setArchivedata] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      try {
        const catRes = await getApi("category");
        setCategories(catRes?.categories || []);

        const formData = {
          start_date: startDate,
          end_date: endDate,
          category_id: "",
          limit: 12,
          offset: 0,
        };

        const archiveRes = await postApi("archive", formData);
        const initialData = archiveRes?.data || [];

        setArchivedata(initialData);
        setOffset(initialData.length);
        setHasMore(initialData.length === 12);

        document.title = "আর্কাইভ - News Portal";
        updateMeta("description", "আর্কাইভ - News Portal");
        updateMeta("keywords", "archive, news portal");
      } catch (err) {
        console.error("Archive initial fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitial();
  }, []);

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

  const fetchArchive = async (params, append = false) => {
    setLoading(true);
    try {
      const adjustedParams = { ...params };

      if (adjustedParams.end_date) {
        const end = new Date(adjustedParams.end_date);
        end.setHours(23, 59, 59, 999);
        adjustedParams.end_date = end.toISOString();
      }

      const res = await postApi("archive", adjustedParams);
      let newData = res?.data || [];

      if (append) {
        setArchivedata((prev) => [...prev, ...newData]);
        setOffset((prev) => prev + newData.length);
      } else {
        setArchivedata(newData);
        setOffset(newData.length);
      }

      setHasMore(newData.length === 12 && newData.length > 0);
    } catch (err) {
      console.error("Archive fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchArchive({
      start_date: startDate,
      end_date: endDate,
      category_id: categoryId,
      limit: 12,
      offset: 0,
    }, false);
  };

  const handleLoadMore = () => {
    fetchArchive({
      start_date: startDate,
      end_date: endDate,
      category_id: categoryId,
      limit: 12,
      offset: offset,
    }, true);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-12 mt-3">
          <div className="CatTitle">
            <h1 className="text-center">আর্কাইভ</h1>
          </div>
        </div>
      </div>

      <form className="form-inline" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-lg-10 m-auto">
            <div className="row">
              <div className="col-sm-4 my-2">
                <label htmlFor="start_date">তারিখ হতে:</label>
                <input
                  type="date"
                  className="form-control"
                  id="start_date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="col-sm-4 my-2">
                <label htmlFor="end_date">তারিখ পর্যন্ত:</label>
                <input
                  type="date"
                  className="form-control"
                  id="end_date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="col-sm-4 my-2">
                <label htmlFor="category_id">বিভাগ:</label>
                <select
                  id="category_id"
                  className="form-control"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">সকল খবর</option>
                  {categories.map((cat) => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>
                      {cat.CategoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center my-4">
          <button type="submit" className="btn btn-primary">
            খুঁজুন
          </button>
        </div>
      </form>

      <div className="category-area">
        <div className="row">
          {loading && archivedata.length === 0 ? (
            <p className="text-center">লোড হচ্ছে...</p>
          ) : archivedata.length === 0 ? (
            <p className="text-center">কোনো তথ্য পাওয়া যায়নি।</p>
          ) : (
            archivedata.map((nc, idx) => (
              <div className="col-lg-6" key={idx}>
                <Link href={`/details/${nc.Slug}/${nc.ContentID}`}>
                  <div className="card mb-3 mt-3">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_IMG_PATH}${nc.ImageBgPath}`}
                      alt={nc.DetailsHeading}
                      title={nc.DetailsHeading}
                      width={400}
                      height={250}
                      className="card-img-top img-fluid"
                    />
                    <div className="card-body">
                      <h5>{nc.DetailsHeading}</h5>
                      <p>{nc.ContentBrief}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {hasMore && archivedata.length > 0 && (
        <div className="col-12 text-center my-4 loadMorebtn">
          <button className="btn btn-primary" onClick={handleLoadMore} disabled={loading}>
            {loading ? "লোড হচ্ছে..." : "আরো দেখুন"}
          </button>
        </div>
      )}

      {!hasMore && archivedata.length > 0 && (
        <p className="text-center my-4">সব খবর দেখানো হয়েছে।</p>
      )}
    </div>
  );
}
