"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  Shield,
  Globe,
  Settings,
  BarChart3,
  Monitor,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  MessageSquare,
  Palette,
  Code,
  Building,
  Mail,
  Phone,
} from "lucide-react"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState("video")

  const features = [
    {
      id: "video",
      icon: Video,
      title: "HD Video Conferencing",
      description: "Crystal clear video calls with up to 1000 participants",
      details:
        "Advanced video compression, adaptive bitrate, and real-time quality optimization ensure smooth video experiences even on low bandwidth connections.",
    },
    {
      id: "screen",
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your screen, applications, or specific windows",
      details:
        "Multi-participant screen sharing with annotation tools, recording capabilities, and quality controls for professional presentations.",
    },
    {
      id: "whiteboard",
      icon: Palette,
      title: "Interactive Whiteboard",
      description: "Collaborate in real-time with drawing tools and shapes",
      details:
        "Professional whiteboard with layers, templates, sticky notes, and export options for enhanced collaboration.",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Instant messaging with file sharing and reactions",
      details: "Persistent chat history, file attachments, emoji reactions, and private messaging capabilities.",
    },
    {
      id: "recording",
      icon: Play,
      title: "Meeting Recording",
      description: "Record meetings with automatic transcription",
      details: "Cloud-based recording with AI-powered transcription, searchable content, and easy sharing options.",
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and advanced security controls",
      details:
        "SOC 2 compliant with waiting rooms, meeting locks, and comprehensive admin controls for enterprise security.",
    },
  ]

  const integrations = [
    { name: "Slack", logo: "💬" },
    { name: "Microsoft Teams", logo: "🟦" },
    { name: "Google Workspace", logo: "🔵" },
    { name: "Zoom", logo: "📹" },
    { name: "Salesforce", logo: "☁️" },
    { name: "HubSpot", logo: "🧡" },
    { name: "Notion", logo: "📝" },
    { name: "Trello", logo: "🔷" },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechCorp",
      content:
        "Meetspace transformed our remote collaboration. The integration was seamless and our team productivity increased by 40%.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Product Manager, StartupXYZ",
      content: "The whiteboard feature is game-changing for our design reviews. Best meeting platform we've used.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "HR Director, GlobalCorp",
      content: "Easy to deploy across our 500+ employee organization. The admin controls are exactly what we needed.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Meetspace
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#integrations" className="text-gray-600 hover:text-blue-600 transition-colors">Integrations</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
            🚀 Now supporting 1000+ participants
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            The Future of
            <br />
            Team Collaboration
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Meetspace is the integrable meeting platform that transforms how organizations connect, collaborate, and create together. 
            Built for the modern workplace with enterprise-grade security and seamless integrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              <Play className="mr-2 w-4 h-4" />
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Image/Video Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1">
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <img 
                  src="/placeholder.svg?height=600&width=1000&text=Meetspace+Demo" 
                  alt="Meetspace Platform Demo"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need for Modern Meetings</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for teams of all sizes, from startups to enterprise organizations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {features.map((feature) => (
                <Card 
                  key={feature.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    activeFeature === feature.id 
                      ? 'border-blue-500 shadow-lg bg-blue-50' 
                      : 'hover:border-gray-300'
                  }`}
                  onClick={() => setActiveFeature(feature.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        activeFeature === feature.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <feature.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="lg:pl-8">
              <Card className="border-2 border-blue-200">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-600 text-white rounded-lg">
                      {features.find(f => f.id === activeFeature)?.icon && (\
                        <features.find(f => f.id === activeFeature).icon className="w-6 h-6\" />
                      )}
                    </div>
                    <CardTitle className="text-2xl">
                      {features.find(f => f.id === activeFeature)?.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {features.find(f => f.id === activeFeature)?.details}
                  </p>
                  <div className="bg-gray-100 rounded-lg p-6 text-center">
                    <img 
                      src={`/placeholder.svg?height=300&width=400&text=${features.find(f => f.id === activeFeature)?.title}+Demo`}
                      alt={`${features.find(f => f.id === activeFeature)?.title} Demo`}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect Meetspace with your existing tools and workflows. Our API-first approach makes integration simple.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-3">{integration.logo}</div>
                <h3 className="font-semibold">{integration.name}</h3>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg">
              <Code className="mr-2 w-4 h-4" />
              View API Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Organization Onboarding */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for Organizations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-ready features that scale with your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Enterprise SSO</h3>
              <p className="text-gray-600 mb-4">
                Single sign-on integration with Active Directory, SAML, and OAuth providers
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Active Directory sync</li>
                <li>• SAML 2.0 support</li>
                <li>• Multi-factor authentication</li>
              </ul>
            </Card>

            <Card className="text-center p-8">
              <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive insights into meeting usage, engagement, and productivity
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Usage dashboards</li>
                <li>• Engagement metrics</li>
                <li>• Custom reports</li>
              </ul>
            </Card>

            <Card className="text-center p-8">
              <Settings className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-3">Admin Controls</h3>
              <p className="text-gray-600 mb-4">
                Centralized management with granular permissions and policy controls
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• User management</li>
                <li>• Policy enforcement</li>
                <li>• Audit logs</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-600">See what our customers are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your organization</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small teams</p>
              <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-gray-500">/user/month</span></div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Up to 25 participants</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />HD video & audio</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Screen sharing</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Basic integrations</li>
              </ul>
              <Button className="w-full">Start Free Trial</Button>
            </Card>

            <Card className="p-8 text-center border-2 border-blue-500 relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">Most Popular</Badge>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-gray-600 mb-6">For growing organizations</p>
              <div className="text-4xl font-bold mb-6">$19<span className="text-lg text-gray-500">/user/month</span></div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Up to 100 participants</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Recording & transcription</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Whiteboard collaboration</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Advanced integrations</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Analytics dashboard</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Free Trial</Button>
            </Card>

            <Card className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Unlimited participants</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Enterprise SSO</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Advanced security</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Dedicated support</li>
                <li className="flex items-center"><CheckCircle className="w-5 h-5 text-green-500 mr-2" />Custom integrations</li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent">Contact Sales</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Meetings?</h2>
            <p className="text-xl text-gray-600">Get started today or contact our team for a personalized demo</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span>sales@meetspace.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-blue-600" />
                  <span>Available 24/7 worldwide</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4">Why Choose Meetspace?</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• 99.9% uptime guarantee</li>
                  <li>• Enterprise-grade security</li>
                  <li>• 24/7 customer support</li>
                  <li>• Easy integration & setup</li>
                  <li>• Scalable for any organization size</li>
                </ul>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Request a Demo</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" />
                  <Input placeholder="Last Name" />
                </div>
                <Input placeholder="Work Email" type="email" />
                <Input placeholder="Company Name" />
                <Input placeholder="Phone Number" />
                <Textarea placeholder="Tell us about your organization's needs..." />
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Request Demo
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Meetspace</span>
              </div>
              <p className="text-gray-400">
                The integrable meeting platform for modern organizations.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Meetspace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
