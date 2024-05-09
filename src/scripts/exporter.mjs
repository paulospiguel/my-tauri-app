import { createWriteStream } from "fs";
import { Readable, Transform, pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

const outputFile = process.argv[2];

const main = async () => {
  console.log("Exporting data to CSV file...");
  console.log("Output file:", outputFile);

  const readableStream = Readable({
    read() {
      for (let i = 0; i < 10; i++) {
        const person = {
          id: Date.now(),
          name: `Person ${i}`,
        };
        const data = JSON.stringify(person);
        this.push(data);
      }
      this.push(null);
    },
  });

  const writableMapXlsx = Transform({
    transform(chunk, encoding, callback) {
      const data = JSON.parse(chunk);
      const row = `${data.id},${data.name}\n`;
      callback(null, row);
    },
  });

  const setHeader = Transform({
    transform(chunk, encoding, callback) {
      this.counter = this.counter ?? 0;

      if (this.counter) {
        callback(null, chunk);
        return;
      }

      const header = "id,name\n";

      this.counter += 1;
      callback(null, header.concat(chunk));
    },
  });

  await pipelineAsync(
    readableStream,
    writableMapXlsx,
    setHeader,
    createWriteStream(outputFile)
  );
};

main();
