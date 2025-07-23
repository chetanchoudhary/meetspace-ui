"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { MeetingRoom } from "@/components/MeetingRoom"
import {
  Video,
  Monitor,
  MessageSquare,
  PenTool,
  Shield,
  Star,
  Check,
  Play,
  ArrowRight,
  Mail,
  Phone,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Settings,
  Headphones,
  Clock,
  Award,
} from "lucide-react"

export default function Home() {
  const [showMeeting, setShowMeeting] = useState(false)
  const [meetingConfig, setMeetingConfig] = useState({
    token: "",
    meetingId: "",
    participantName: "",
  })
  const [activeFeature, setActiveFeature] = useState("video")

  const features = [
    {
      id: "video",
      icon: Video,
      title: "HD Video Conferencing",
      description:
        "Crystal clear video calls with up to 1000 participants. Advanced noise cancellation and automatic quality adjustment.",
      benefits: ["4K video quality", "Noise cancellation", "Auto bandwidth optimization", "Virtual backgrounds"],
    },
    {
      id: "screen",
      icon: Monitor,
      title: "Screen Sharing & Recording",
      description:
        "Share your screen, applications, or specific windows. Record meetings with automatic transcription.",
      benefits: ["Application sharing", "Meeting recording", "Auto transcription", "Cloud storage"],
    },
    {
      id: "chat",
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Instant messaging with file sharing, emoji reactions, and persistent chat history.",
      benefits: ["File sharing", "Emoji reactions", "Chat history", "Private messaging"],
    },
    {
      id: "whiteboard",
      icon: PenTool,
      title: "Interactive Whiteboard",
      description: "Collaborative whiteboard with drawing tools, shapes, and real-time synchronization.",
      benefits: ["Drawing tools", "Shape library", "Real-time sync", "Export options"],
    },
    {
      id: "security",
      icon: Shield,
      title: "Enterprise Security",
      description: "End-to-end encryption, SSO integration, and compliance with industry standards.",
      benefits: ["E2E encryption", "SSO integration", "GDPR compliant", "Admin controls"],
    },
    {
      id: "analytics",
      icon: BarChart3,
      title: "Meeting Analytics",
      description: "Detailed insights into meeting engagement, participation, and performance metrics.",
      benefits: ["Engagement tracking", "Participation metrics", "Performance insights", "Custom reports"],
    },
  ]

  const integrations = [
    "Slack",
    "Microsoft Teams",
    "Google Workspace",
    "Zoom",
    "Salesforce",
    "Trello",
    "Asana",
    "Notion",
    "GitHub",
    "Jira",
    "Calendly",
    "HubSpot",
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO at TechCorp",
      content:
        "Meetspace transformed our remote collaboration. The video quality is exceptional and the integrations are seamless.",
      rating: 5,
    },
    {
      name: "Michael Rodriguez",
      role: "Product Manager at StartupXYZ",
      content:
        "The whiteboard feature is a game-changer for our design reviews. Our team productivity increased by 40%.",
      rating: 5,
    },
    {
      name: "Emily Johnson",
      role: "HR Director at GlobalInc",
      content:
        "Easy to deploy across our organization. The security features give us peace of mind for confidential meetings.",
      rating: 5,
    },
  ]

  const pricingPlans = [
    {
      name: "Starter",
      price: "$9",
      period: "per user/month",
      features: [
        "Up to 100 participants",
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
      features: [
        "Up to 500 participants",
        "4K video & audio",
        "Recording & transcription",
        "Advanced chat & files",
        "10GB cloud storage",
        "Whiteboard & annotations",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      features: [
        "Unlimited participants",
        "Custom branding",
        "Advanced security",
        "SSO integration",
        "Unlimited storage",
        "API access",
        "24/7 dedicated support",
      ],
      popular: false,
    },
  ]

  const handleJoinDemo = () => {
    setMeetingConfig({
      token: "demo-token",
      meetingId: "demo-room",
      participantName: "Demo User",
    })
    setShowMeeting(true)
  }

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    setMeetingConfig({
      token: formData.get("token") as string,
      meetingId: formData.get("meetingId") as string,
      participantName: formData.get("participantName") as string,
    })
    setShowMeeting(true)
  }

  if (showMeeting) {
    return (
      <MeetingRoom
        token={meetingConfig.token}
        meetingId={meetingConfig.meetingId}
        participantName={meetingConfig.participantName}
      />
    )
  }

  const activeFeatureData = features.find((f) => f.id === activeFeature)
  const ActiveIcon = activeFeatureData?.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">Meetspace</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </a>
              <Button
                onClick={handleJoinDemo}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                Try Demo
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            The Future of Team
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Collaboration
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Meetspace is the integrable meeting platform that transforms how organizations connect, collaborate, and
            create together. Experience seamless video conferencing with enterprise-grade security.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleJoinDemo} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              <Play className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-8 py-3 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features for Modern Teams</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to run productive meetings and collaborate effectively
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      activeFeature === feature.id
                        ? "bg-blue-600/20 border-blue-500"
                        : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                    }`}
                    onClick={() => setActiveFeature(feature.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-3 rounded-lg ${activeFeature === feature.id ? "bg-blue-600" : "bg-gray-700"}`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                          <p className="text-gray-400 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Feature Preview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-blue-600 text-white rounded-lg">
                      {ActiveIcon && <ActiveIcon className="w-6 h-6" />}
                    </div>
                    <CardTitle className="text-2xl text-white">{activeFeatureData?.title}</CardTitle>
                  </div>

                  <p className="text-gray-300 mb-6">{activeFeatureData?.description}</p>

                  <div className="bg-gray-900 rounded-lg p-6 mb-6">
                    <div className="text-gray-400 text-sm mb-2">Feature Preview</div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded h-32 flex items-center justify-center">
                      {ActiveIcon && <ActiveIcon className="w-12 h-12 text-blue-400" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {activeFeatureData?.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Seamless Integrations</h2>
          <p className="text-xl text-gray-300 mb-12">Connect with your favorite tools and workflows</p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {integrations.map((integration) => (
              <Card key={integration} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-300">{integration}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
          >
            View All Integrations
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Organization Features */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for Organizations</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Enterprise-grade features that scale with your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Lock className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
                <p className="text-gray-400">End-to-end encryption, SSO, and compliance with SOC 2, HIPAA, and GDPR</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Admin Controls</h3>
                <p className="text-gray-400">
                  Centralized management, user provisioning, and detailed analytics dashboard
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">API Integration</h3>
                <p className="text-gray-400">
                  RESTful APIs and webhooks for custom integrations and workflow automation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Teams Worldwide</h2>
            <p className="text-xl text-gray-300">See what our customers are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your team's needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "bg-blue-600/20 border-blue-500 scale-105" : "bg-gray-800/50 border-gray-700"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${
                      plan.popular ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Demo */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">Get Started Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Ready to transform your team's collaboration? Contact us for a personalized demo.
              </p>

              <div className="space-y-6 mb-8">
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-gray-400">hello@meetspace.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-white font-semibold">Support Hours</p>
                    <p className="text-gray-400">24/7 Global Support</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">99.9% Uptime</p>
                </div>
                <div className="text-center">
                  <Headphones className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">24/7 Support</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">SOC 2 Certified</p>
                </div>
              </div>
            </div>

            {/* Demo Request Form */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Request a Demo</CardTitle>
                <p className="text-gray-400">See Meetspace in action with a personalized demo</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">
                      First Name
                    </Label>
                    <Input id="firstName" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">
                      Last Name
                    </Label>
                    <Input id="lastName" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Work Email
                  </Label>
                  <Input id="email" type="email" className="bg-gray-700 border-gray-600 text-white" />
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-300">
                    Company
                  </Label>
                  <Input id="company" className="bg-gray-700 border-gray-600 text-white" />
                </div>

                <div>
                  <Label htmlFor="teamSize" className="text-gray-300">
                    Team Size
                  </Label>
                  <Input
                    id="teamSize"
                    placeholder="e.g., 50-100 employees"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-300">
                    Message (Optional)
                  </Label>
                  <Textarea id="message" className="bg-gray-700 border-gray-600 text-white" rows={3} />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Schedule Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Join Meeting Section */}
      <section className="py-20 bg-black/20">
        <div className="container mx-auto px-4 max-w-md">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Join a Meeting</CardTitle>
              <p className="text-gray-400">Enter your meeting details to join</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoinMeeting} className="space-y-4">
                <div>
                  <Label htmlFor="token" className="text-gray-300">
                    Token
                  </Label>
                  <Input
                    id="token"
                    name="token"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter your meeting token"
                  />
                </div>

                <div>
                  <Label htmlFor="meetingId" className="text-gray-300">
                    Meeting ID
                  </Label>
                  <Input
                    id="meetingId"
                    name="meetingId"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter meeting ID"
                  />
                </div>

                <div>
                  <Label htmlFor="participantName" className="text-gray-300">
                    Your Name
                  </Label>
                  <Input
                    id="participantName"
                    name="participantName"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Enter your name"
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Meeting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Meetspace</span>
              </div>
              <p className="text-gray-400 mb-4">
                The future of team collaboration. Connect, create, and collaborate with confidence.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Integrations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-white/10" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Meetspace. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
