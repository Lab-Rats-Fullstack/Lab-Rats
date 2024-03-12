import { useState, useEffect } from "react";

export default function Loading() {
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    setTimeout(() => setWaiting(true), 10000);
  }, []);
  return (
    <div className="loadingContainer">
      <p className="loading">Loading</p>
      {waiting && (
        <p>
          Still Waiting? Culinary Chronicle is run on a free database and web
          service that sometimes involves long wait times. Try refreshing the
          page now that the service is up and running.
        </p>
      )}
    </div>
  );
}
