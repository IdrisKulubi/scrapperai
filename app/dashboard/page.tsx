import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import  db  from "@/db/drizzle"
import { scrapedData } from "@/db/schema"

export default async function Dashboard() {
  const opportunities = await db.select().from(scrapedData)

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sustainability Opportunities</h1>
        <Button asChild>
          <Link href="/api/scrape?source=afdb">Refresh Data</Link>
        </Button>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Source</th>
                <th className="text-left p-2">Sector</th>
                <th className="text-left p-2">Relevance</th>
                <th className="text-left p-2">Deadline</th>
                <th className="text-left p-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => (
                <tr key={opp.id} className="border-b hover:bg-muted/50">
                  <td className="p-2">{opp.source}</td>
                  <td className="p-2 capitalize">{opp.sector}</td>
                  <td className="p-2">{opp.relevanceScore}%</td>
                  <td className="p-2">
                    {opp.deadline?.toLocaleDateString() || 'N/A'}
                  </td>
                  <td className="p-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={opp.url} target="_blank">
                        View Details
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
} 