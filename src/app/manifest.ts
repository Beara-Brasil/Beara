import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Beara",
    short_name: "Beara",
    description: "Software house e consultoria. Beara Delivery, Agro e School.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F5F8",
    theme_color: "#1E3A8A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
