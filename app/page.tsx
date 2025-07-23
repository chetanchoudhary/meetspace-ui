"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  MessageSquare,
  Monitor,
  Shield,
  Zap,
  Globe,
  Star,
  Check,
  ArrowRight,
  Play,
  Phone,
  Mail,
  MapPin,
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
        "Experience high-definition video conferencing with advanced noise cancellation, virtual backgrounds, and adaptive bitrate streaming for optimal quality on any connection.",
    },
    {
      id: "screen",
      icon: Monitor,
      title: "Screen Sharing",
      description: "Share your screen with advanced controls and annotations",
      details:
        "Share your entire screen, specific applications, or browser tabs with real-time annotations, cursor highlighting, and remote control capabilities.",
    },
    {
      id: "whiteboard",
      icon: MessageSquare,
      title: "Interactive Whiteboard",
      description: "Collaborate in real-time with digital whiteboard tools",
      details:
        "Draw, write, and brainstorm together with an infinite canvas, shape recognition, sticky notes, and template library for enhanced collaboration.",
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Team Chat",
      description: "Integrated messaging with file sharing and reactions",
      details:
        "Stay connected with persistent chat, file sharing, emoji reactions, message threading, and searchable conversation history.",
    },
    {
      id: "recording",
      icon: Video,
      title: "Meeting Recording",
      description: "Record and transcribe meetings automatically",
      details:
        "Automatically record meetings with AI-powered transcription, searchable content, highlight reels, and secure cloud storage with sharing controls.",
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption and compliance ready",
      details:
        "Bank-grade security with end-to-end encryption, SSO integration, compliance certifications (SOC 2, HIPAA), and advanced admin controls.",
    },
  ]

  const integrations = [
    "Slack",
    "Microsoft Teams",
    "Google Workspace",
    "Zoom",
    "Salesforce",
    "HubSpot",
    "Notion",
    "Trello",
    "Asana",
    "GitHub",
    "Jira",
    "Confluence",
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO",
      company: "TechCorp",
      content:
        "Meetspace has transformed how our distributed team collaborates. The video quality is exceptional and the integrations are seamless.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager",
      company: "StartupXYZ",
      content:
        "The whiteboard feature is a game-changer for our design reviews. We can brainstorm and iterate in real-time like never before.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "HR Director",
      company: "GlobalInc",
      content:
        "Rolling out Meetspace across our organization was effortless. The admin controls and security features give us complete peace of mind.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "per user/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 25 participants",
        "HD video & audio",
        "Screen sharing",
        "Basic chat",
        "1GB cloud storage",
        "Email support",
      ],
      popular: false,
    },
    {
      name: "Professional",
      price: "$19",
      period: "per user/month",
      description: "Advanced features for growing teams",
      features: [
        "Up to 100 participants",
        "4K video & audio",
        "Advanced screen sharing",
        "Interactive whiteboard",
        "Meeting recording",
        "10GB cloud storage",
        "Priority support",
        "Basic integrations",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Full-scale solution for large organizations",
      features: [
        "Unlimited participants",
        "Enterprise-grade security",
        "Advanced admin controls",
        "Custom integrations",
        "Unlimited storage",
        "24/7 dedicated support",
        "SLA guarantee",
        "Custom branding",
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3"></div>
              <span className="text-2xl font-bold text-gray-900">Meetspace</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </a>
              <a href="#integrations" className="text-gray-600 hover:text-gray-900">
                Integrations
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button asChild>
                <a href="/meeting?token=demo&roomid=demo">Try Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">The Future of Team Collaboration</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Meetspace is the integrable meeting platform that brings your organization together with seamless video
              conferencing, interactive collaboration tools, and enterprise-grade security.
            </p>
            <div className="flex justify-center space-x-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Play className="mr-2 w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Teams</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to collaborate effectively, from video calls to interactive whiteboards
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              {features.map((feature) => {
                const IconComponent = feature.icon
                return (
                  <Card
                    key={feature.id}
                    className={`cursor-pointer transition-all ${
                      activeFeature === feature.id ? "border-blue-500 shadow-lg" : "hover:shadow-md"
                    }`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-blue-600 text-white rounded-lg">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{feature.title}</h3>
                          <p className="text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      {activeFeature === feature.id && <p className="text-gray-700 mt-4">{feature.details}</p>}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  {(() => {
                    const activeFeatureData = features.find((f) => f.id === activeFeature)
                    if (activeFeatureData) {
                      const IconComponent = activeFeatureData.icon
                      return <IconComponent className="w-8 h-8 text-white" />
                    }
                    return null
                  })()}
                </div>
                <h4 className="text-lg font-semibold mb-2">{features.find((f) => f.id === activeFeature)?.title}</h4>
                <p className="text-gray-600">Interactive demo preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section id="integrations" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect Meetspace with your favorite tools and workflows
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {integrations.map((integration) => (
              <div key={integration} className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{integration.slice(0, 2)}</span>
                </div>
                <p className="text-sm text-gray-600">{integration}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline">
              View All Integrations
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Organization Onboarding */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Organizations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deploy Meetspace across your entire organization with enterprise-grade features and support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Enterprise Security</h3>
                <p className="text-gray-600">
                  SSO integration, advanced admin controls, and compliance certifications for peace of mind
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Scalable Performance</h3>
                <p className="text-gray-600">
                  Built to handle organizations of any size, from startups to Fortune 500 companies
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-4">Global Deployment</h3>
                <p className="text-gray-600">
                  Worldwide infrastructure ensures optimal performance for distributed teams
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-600">See what our customers have to say about Meetspace</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that fits your team's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <p className="text-xl text-gray-600 mb-8">
                Ready to transform your team's collaboration? Contact us for a personalized demo or to discuss your
                organization's needs.
              </p>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">hello@meetspace.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-600">123 Innovation Drive, San Francisco, CA 94105</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Why Choose Meetspace?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>99.9% uptime guarantee</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>24/7 customer support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Enterprise-grade security</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Easy integration with existing tools</span>
                  </li>
                </ul>
              </div>
            </div>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Request a Demo</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Email</label>
                    <Input type="email" placeholder="john@company.com" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <Input placeholder="Your Company" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                    <Input placeholder="e.g., 50-100 employees" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <Textarea placeholder="Tell us about your collaboration needs..." rows={4} />
                  </div>

                  <Button className="w-full" size="lg">
                    Request Demo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mr-3"></div>
                <span className="text-2xl font-bold">Meetspace</span>
              </div>
              <p className="text-gray-400">
                The future of team collaboration, bringing organizations together with seamless video conferencing and
                interactive tools.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Privacy Policy
                  </a>
                </li>
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
