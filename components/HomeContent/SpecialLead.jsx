import Link from "next/link";
import getApi from "../../app/lib/getApi";

const SpecialLead = async () => {
  // Fetch data server-side
  const list = await getApi("home-json-bn/generateSpecialTopOne.json");
  const leadData = list?.slice(0, 4) || [];

  if (!leadData.length) return null;

  return (
    <div className="container">
      <div className="row">
        {leadData.map((nc, i) => (
          <div className="col-lg-3" key={i}>
            <div className="card-content">
              <h4 className="title">
                <Link href={`/details/${nc.categorySlug}/${nc.ContentID}`}>
                  {nc.DetailsHeading}
                </Link>
              </h4>
              <p className="intro">{nc.ContentBrief}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpecialLead;
