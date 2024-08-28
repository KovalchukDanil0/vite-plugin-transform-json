import { Plugin, ResolvedConfig } from "vite";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join, parse } from "path";

export type CopyAndTransformPluginType = {
  srcPath: string;
  transformedProps: AsyncOrSyncFunction<{
    [key: string]: string | object | undefined;
  }>;
};

type AsyncOrSyncFunction<T> = (() => T) | (() => Promise<T>);

export default function viteCopyTransformJson({
  srcPath,
  transformedProps,
}: CopyAndTransformPluginType): Plugin {
  let config: ResolvedConfig;

  return {
    name: "vite-plugin-transform-json",
    apply: "build", // Apply only during build

    configResolved(tempResolve) {
      config = tempResolve;
    },

    async generateBundle() {
      const destDir = config.build.outDir;
      const fileName = parse(srcPath).base;
      const destPath = join(destDir, fileName);

      try {
        // Read the original file.json
        const content = await readFile(srcPath, "utf-8");

        const originalJson = JSON.parse(content);
        const resolvedProps = await transformedProps();

        // Merge with additional data
        const transformedJson = {
          ...resolvedProps,
          ...originalJson,
        };

        // Ensure the destination directory exists
        await mkdir(destDir, { recursive: true });

        // Write the transformed file.json
        await writeFile(destPath, JSON.stringify(transformedJson), "utf-8");

        console.log(`${fileName} has been copied and transformed.`);
      } catch (error) {
        console.error(
          `Failed to copy and transform ${fileName}: ${
            (error as Error).message
          }`
        );
      }
    },
  };
}
