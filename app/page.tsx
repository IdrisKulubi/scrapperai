import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Leaf, ShieldCheck, BarChart } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "SustainScraper - AI-Powered Sustainability Opportunity Finder",
  description: "Discover African sustainability projects and funding opportunities through AI-enhanced web scraping",
}

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center py-20 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
          Empowering Sustainable Development
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          AI-curated opportunities in energy, agriculture, and water management across Africa
        </p>
        
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8 py-16">
        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <Globe className="w-12 h-12 text-primary mb-4" />
            <CardTitle>Comprehensive Scraping</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Monitor 20+ official sources across African nations with automated updates
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <Leaf className="w-12 h-12 text-primary mb-4" />
            <CardTitle>AI Filtering</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              GPT-4 powered relevance scoring with sector-specific classification
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <CardHeader>
            <ShieldCheck className="w-12 h-12 text-primary mb-4" />
            <CardTitle>GDPR Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Ethical data practices with no PII storage and automatic data retention policies
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">200+</div>
            <p className="text-sm text-muted-foreground">Opportunities Tracked</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">95%</div>
            <p className="text-sm text-muted-foreground">Relevance Accuracy</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">24h</div>
            <p className="text-sm text-muted-foreground">Update Frequency</p>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">15+</div>
            <p className="text-sm text-muted-foreground">African Nations Covered</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center space-y-6">
        <BarChart className="w-16 h-16 mx-auto text-primary" />
        <h2 className="text-3xl font-bold">Start Discovering Opportunities</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Join governments, NGOs, and investors in uncovering sustainable development projects
        </p>
        <Button size="lg" className="mt-4">Explore Dashboard</Button>
      </section>
    </div>
  )
}