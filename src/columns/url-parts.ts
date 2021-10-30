import * as glide from "../glide";

const parts: Record<string, (url: URL) => string> = {
    host: x => x.host,
    hostname: x => x.hostname,
    protocol: x => x.protocol,
    search: x => x.search,
    hash: x => x.hash,
    all: x => x.toJSON(),
};

export default glide
    .columnNamed("Get Part of URL")
    .withCategory("Data & APIs")
    .withDescription(`Extract pieces of a URL.`)
    .withReleased("direct")

    .withRequiredURIParam("uri", "URL")
    .withStringParam("part", `Part (${Object.keys(parts).sort().join(", ")}, or search parameter name)`)
    .withStringResult()

    .withTest({ uri: "https://www.glideapps.com", part: "hostname" }, "www.glideapps.com")
    .withTest({ uri: "https://www.glideapps.com", part: "protocol" }, "https:")
    .withTest({ uri: "https://www.glideapps.com?message=hello%20world", part: "message" }, "hello world")

    .run(({ uri, part = "all" }) => {
        try {
            const url = new URL(uri);
            const extractPart = parts[part];
            if (extractPart !== undefined) {
                return extractPart(url);
            }
            if (url.searchParams.has(part)) {
                return url.searchParams.get(part);
            }
            return undefined;
        } catch {
            return undefined;
        }
    });
