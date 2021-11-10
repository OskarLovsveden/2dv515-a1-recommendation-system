import fs from 'fs'
import { parse } from 'csv'

const processFile = async () => {
    const records = []

    const parser = fs
        .createReadStream(`./movies_example/users.csv`)
        .pipe(parse({
            from_line: 2,
            delimiter: ";"
        }))
    
    for await (const record of parser) {
        records.push({ id: parseInt(record[0]), name: record[1] })
    }

    return records
}

export default async function handler (req, res) {
  res.status(200).json(await processFile())
}