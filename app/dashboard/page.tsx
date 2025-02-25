import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import db from "@/db/drizzle"
import { scrapedData } from "@/db/schema"
import { getPrioritizedSources, sources } from "@/lib/scrapers/sources"

export default async function Dashboard() {
  const opportunities = await db.select().from(scrapedData).orderBy(scrapedData.createdAt, 'desc').limit(100)
  const topSources = getPrioritizedSources().slice(0, 5)

  // Helper function to find source ID by name
  const getSourceIdByName = (name: string): string => {
    return Object.entries(sources).find(([id, config]) => 
      config.name === name
    )?.[0] || '';
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sustainability Opportunities</h1>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/api/scrape?all=true">Scrape All Sources</Link>
            </Button>
            <Button asChild>
              <Link href="/api/scrape?source=afdb">Refresh AFDB</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSources.map((source) => {
            // Get the source ID for this source
            const sourceId = getSourceIdByName(source.name);
            
            return (
              <Card key={source.name} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground">{source.category} • {source.updateFrequency}</p>
                  </div>
                  <Button size="sm" asChild variant="outline">
                    <Link href={`/api/scrape?source=${sourceId}`}>
                      Scrape
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Source</th>
                <th className="text-left p-2">Title</th>
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
                  <td className="p-2">{opp.aiResponse?.title || 'No Title'}</td>
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