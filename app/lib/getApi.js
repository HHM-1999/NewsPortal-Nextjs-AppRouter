export default async function getApi(json) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${json}`, {
      // Cache for App Router
      next: { revalidate: 60 } // cache for 60 seconds
    });
    return res.json();
  }
  