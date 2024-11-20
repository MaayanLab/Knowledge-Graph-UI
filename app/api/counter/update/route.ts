import neo4j from "neo4j-driver"
import { neo4jDriver } from "@/utils/neo4j"
import { toNumber } from "@/utils/math"; 
import { NextResponse } from "next/server";

export async function GET() {
    // open read and write sessions for neo4j
    try {
        const read_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.READ
        })
        const write_session = neo4jDriver.session({
            defaultAccessMode: neo4j.session.WRITE
        })
        try {
            // try to get a count from a counter node
            const query = "MATCH (a:Counter) RETURN a.count"
            const rs = await read_session.readTransaction(txc => txc.run(query))
            // if there is nothing returned, craete a new node
            if (rs.records.length === 0) {
                const query = "CREATE (n:Counter {count: 1})"
                // write this node to neo4j
                const rs = await write_session.run(query)
                // report back success
                return NextResponse.json({count: 1},  {status: 200})
            } else {
                // otherwise get the count from the counter node, increase it by one, and get the count
                const query = `MATCH (p:Counter)
                SET p.count = p.count + 1
                RETURN p.count as count`
                // write the updated count to neo4j
                const rs = await write_session.run(query)
                // from the results, get the count (return value)
                const results = rs.records.flatMap(record => {
                    const count = toNumber(record.get("count"))
                    return {count}
                })[0]
                // report back that everything went okay
                return NextResponse.json(results,  {status: 200})
            }
        } catch (e) {
            console.log(e.message)
            return NextResponse.json(e, {status: 400})
        } finally {
            read_session.close()
            write_session.close()
        }
    } catch (error) {
        console.log(error)
        return NextResponse.error()
    }
}

export const revalidate = 0;