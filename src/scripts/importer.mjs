import * as fs from "fs";
import { Readable, Transform, pipeline } from "stream";
import { promisify } from "util";

const pipelineAsync = promisify(pipeline);

const inputFile = process.argv[2];

const main = async () => {
  console.log("Import data to CSV file...");
  console.log("Import file:", inputFile);

  const readableStream = Readable({
    read() {
      // for (let i = 0; i < 10; i++) {
      //   const person = {
      //     id: Date.now(),
      //     name: `Person ${i}`,
      //   };
      //   const data = JSON.stringify(person);
      //   this.push(data);
      //}

      // read csv file from inputFile and push to readableStream
      const data = fs.readFileSync(inputFile, "utf8");

      console.log(data);
      const lines = data.split("\n");
      lines.forEach((line) => {
        const [id, name] = line.split(",");
        const person = {
          id,
          name,
        };
        const data = JSON.stringify(person);
        this.push(data);
      });

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
    //writableMapXlsx,
    //setHeader,
    //createWriteStream(outputFile)
    process.stdout
  );
};

main();
