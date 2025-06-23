import React from "react";
import { siteConfig } from "../../lib/config";

const EnvDisplay = () => {
  const redisUrl = siteConfig.env.VITE_REDIS_URL;
  const databaseUrl = siteConfig.env.VITE_DATABASE_URL;

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        margin: "20px",
      }}
    >
      <h2>Environment Variables (from siteConfig)</h2>
      <p>
        <strong>Redis URL:</strong> {redisUrl ? redisUrl : "Not set"}
      </p>
      <p>
        <strong>Database URL:</strong> {databaseUrl ? databaseUrl : "Not set"}
      </p>
      <p style={{ fontSize: "0.8em", color: "#666" }}>
        Note: Sensitive variables like these should ideally be used on the
        server-side.
      </p>
    </div>
  );
};

export default EnvDisplay;
