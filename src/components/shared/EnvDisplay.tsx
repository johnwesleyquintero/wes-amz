import React from "react";
import { siteConfig } from "../../lib/config";
import { cn } from "@/lib/utils";

const EnvDisplay = () => {
  const redisUrl = siteConfig.env.VITE_REDIS_URL;
  const databaseUrl = siteConfig.env.VITE_DATABASE_URL;

  return (
    <div
      className={cn(
        "p-5 border border-border rounded-lg m-5",
        "bg-card text-foreground", // Assuming card background and foreground text
      )}
    >
      <h2 className="text-lg font-semibold mb-2">
        Environment Variables (from siteConfig)
      </h2>
      <p className="mb-1">
        <strong className="font-medium">Redis URL:</strong>{" "}
        {redisUrl ? redisUrl : "Not set"}
      </p>
      <p className="mb-1">
        <strong className="font-medium">Database URL:</strong>{" "}
        {databaseUrl ? databaseUrl : "Not set"}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Note: Sensitive variables like these should ideally be used on the
        server-side.
      </p>
    </div>
  );
};

export default EnvDisplay;
