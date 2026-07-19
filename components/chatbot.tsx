"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Bot, User, Heart, ChevronRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [showMoreActions, setShowMoreActions] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm BloodNet Assistant. I can help you with blood donation, registration, finding donors, and answering any questions. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const quickActions = [
    "How do I register as a donor?",
    "Find blood donors near me",
    "What are the donation requirements?",
    "How does the matching work?",
  ]

  const visibleQuickActions = showMoreActions ? quickActions : quickActions.slice(0, 2)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 0)
      }
    }
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const generateBotResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    if (lowerQuestion.includes("register") || lowerQuestion.includes("sign up")) {
      return "To register as a donor, click on 'Become a Donor' in the navigation menu. You'll need to provide your blood type, contact information, and complete a health screening. The process takes about 5 minutes!"
    }

    if (lowerQuestion.includes("find") || lowerQuestion.includes("search") || lowerQuestion.includes("donor")) {
      return "You can find donors by going to 'Find Donors' page. Use the map view to see donors near your location, or filter by blood type. Click on any donor marker to view their complete profile and donation history!"
    }

    if (lowerQuestion.includes("requirement") || lowerQuestion.includes("eligible")) {
      return "To donate blood, you must be: 1) At least 18 years old, 2) Weigh at least 50kg, 3) Be in good health, 4) Not have donated blood in the last 3 months. Visit our Help page for complete requirements!"
    }

    if (lowerQuestion.includes("match") || lowerQuestion.includes("ai") || lowerQuestion.includes("algorithm")) {
      return "Our AI matching algorithm considers blood type compatibility, distance, donor availability, health scores, and donation history to find the best matches. You'll see AI-ranked results with a compatibility score!"
    }

    if (lowerQuestion.includes("emergency") || lowerQuestion.includes("urgent")) {
      return "For emergency blood requests, use the 'Emergency Request' page. Set urgency level to 'Critical' and our system will immediately alert all compatible donors within your area. You can also directly contact hospitals through the Hospital Portal."
    }

    if (lowerQuestion.includes("certificate") || lowerQuestion.includes("reward")) {
      return "Yes! We offer digital certificates (Platinum, Gold, Silver tiers), achievement badges, and tree-planting rewards for donations. Check the Rewards section in your dashboard to view your achievements and download certificates!"
    }

    if (lowerQuestion.includes("hospital")) {
      return "Hospitals can register through the Hospital Portal to post emergency requests, track inventory, and access our donor database. Contact our admin team for hospital verification and setup."
    }

    if (lowerQuestion.includes("safe") || lowerQuestion.includes("secure") || lowerQuestion.includes("verified")) {
      return "All donors undergo health screening and verification. We use secure data encryption, and all connections are verified. Look for the green shield badge to identify verified donors!"
    }

    return "I can help you with registration, finding donors, understanding requirements, emergency requests, rewards, and more. Try asking about specific topics or visit our Help page for detailed guides!"
  }

  return (
    <>
      {/* Chatbot Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 bg-primary hover:bg-primary/90"
        >
          <MessageCircle className="w-6 sm:w-7 h-6 sm:h-7" />
        </Button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-96 md:w-[420px] h-[75vh] sm:h-[650px] md:h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-300 rounded-xl sm:rounded-2xl">
          <Card className="shadow-2xl flex flex-col h-full overflow-hidden rounded-xl sm:rounded-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground p-2.5 sm:p-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Heart className="w-3.5 sm:w-5 h-3.5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0 sm:block hidden">
                    <h3 className="font-semibold text-sm sm:text-base leading-tight truncate">BloodNet Assistant</h3>
                    <p className="text-xs text-white/80">Always here to help</p>
                  </div>
                  <h3 className="font-semibold text-sm text-white truncate sm:hidden">BloodNet</h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-8 sm:w-8 p-0 text-white hover:bg-white/20 rounded-full flex-shrink-0"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-3.5 sm:w-5 h-3.5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Messages - Flexible height, scrollable */}
            <div className="flex-1 overflow-hidden bg-gradient-to-b from-background to-muted/30">
              <ScrollArea ref={scrollAreaRef} className="h-full w-full">
                <div className="p-3 sm:p-5 space-y-3 sm:space-y-5">
                  {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-center py-8">
                      <div className="space-y-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">How can we help you today?</p>
                      </div>
                    </div>
                  )}
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[75%] sm:max-w-[70%] flex flex-col ${message.sender === "user" ? "items-end" : "items-start"}`}>
                        <div
                          className={`rounded-lg sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm transition-all ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-white dark:bg-slate-900 text-foreground rounded-bl-none border border-border/50"
                          }`}
                        >
                          <p className="text-xs sm:text-sm leading-relaxed">{message.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {message.sender === "user" && (
                        <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-2 sm:px-4 py-2 sm:py-3 border-t border-border/50 flex-shrink-0 bg-muted/50">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suggested</p>
                  {quickActions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 px-2 text-xs text-primary hover:bg-primary/10 p-0"
                      onClick={() => setShowMoreActions(!showMoreActions)}
                    >
                      {showMoreActions ? 'Show Less' : 'Show More'}
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {visibleQuickActions.map((action) => (
                    <Button
                      key={action}
                      variant="outline"
                      size="sm"
                      className="text-xs h-auto py-1 sm:py-2 px-2 sm:px-3 bg-white dark:bg-slate-900 border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 rounded justify-start text-left line-clamp-2"
                      onClick={() => {
                        setInputValue(action)
                        setShowMoreActions(false)
                        handleSend()
                      }}
                    >
                      <ChevronRight className="w-2.5 h-2.5 mr-0.5 flex-shrink-0" />
                      <span className="text-xs">{action}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input - Always visible at bottom */}
            <div className="px-2 sm:px-3 py-2 sm:py-3 pb-2 sm:pb-3 border-t border-border/50 flex-shrink-0 bg-background">
              <div className="flex gap-1 sm:gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => !e.nativeEvent.isComposing && e.key === 'Enter' && handleSend()}
                  placeholder="Ask..."
                  className="flex-1 rounded-full px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-muted border-0 focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <Button
                  onClick={handleSend}
                  size="icon"
                  className="flex-shrink-0 rounded-full h-8 w-8 sm:h-9 sm:w-9 hover:scale-110 transition-transform"
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center hidden sm:block">Powered by BloodNet AI</p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
