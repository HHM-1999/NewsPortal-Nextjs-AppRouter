import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left column */}
        <div className="col-md-8">
          <Skeleton height={32} width="80%" className="mb-3" />
          <Skeleton height={20} width="40%" className="mb-2" />
          <Skeleton height={400} className="mb-4" />
          <Skeleton count={6} />
        </div>

        {/* Right column (sidebar) */}
        <div className="col-md-4">
          <h4 className="mb-3 mt-5">
            <Skeleton width={160} height={24} />
          </h4>
          {Array.from({ length: 4 }).map((_, i) => (
            <div className="row mb-3" key={i}>
              <div className="col-lg-5 col-5">
                <Skeleton height={80} />
              </div>
              <div className="col-lg-7 col-7">
                <Skeleton count={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
