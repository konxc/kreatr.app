'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Rocket, Users, Eye, Heart, TrendingUp, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const services = [
  {
    title: 'Instagram Followers',
    description: 'Get real, engaged followers for your Instagram account',
    icon: Users,
    color: 'from-pink-500 to-rose-500',
    packages: [
      { amount: '1,000', price: 15, credits: 15 },
      { amount: '5,000', price: 65, credits: 65 },
      { amount: '10,000', price: 120, credits: 120 },
    ],
  },
  {
    title: 'TikTok Views',
    description: 'Boost your TikTok video views and reach',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    packages: [
      { amount: '10,000', price: 10, credits: 10 },
      { amount: '50,000', price: 45, credits: 45 },
      { amount: '100,000', price: 80, credits: 80 },
    ],
  },
  {
    title: 'Instagram Likes',
    description: 'Increase engagement with authentic likes',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    packages: [
      { amount: '500', price: 8, credits: 8 },
      { amount: '2,000', price: 28, credits: 28 },
      { amount: '5,000', price: 60, credits: 60 },
    ],
  },
  {
    title: 'YouTube Views',
    description: 'Grow your YouTube channel with real views',
    icon: TrendingUp,
    color: 'from-red-500 to-orange-500',
    packages: [
      { amount: '5,000', price: 20, credits: 20 },
      { amount: '25,000', price: 90, credits: 90 },
      { amount: '50,000', price: 160, credits: 160 },
    ],
  },
]

export default function BoostPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Rocket className="w-8 h-8 text-orange-600" />
          SMM Boost Services
        </h1>
        <p className="text-gray-600 mt-2">
          Accelerate your social media growth with professional SMM services
        </p>
      </div>

      {/* Info Banner */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Star className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Premium Quality Guarantee</h3>
            <p className="text-sm text-gray-600">
              All our services deliver real, high-quality engagement from authentic accounts. 
              We guarantee safe delivery and 30-day refill warranty.
            </p>
          </div>
        </div>
      </Card>

      {/* Services Grid */}
      <div className="space-y-8">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.title} className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 mt-1">{service.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {service.packages.map((pkg) => (
                  <div
                    key={pkg.amount}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                  >
                    <div className="text-center mb-4">
                      <p className="text-3xl font-bold text-gray-900">{pkg.amount}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.title.split(' ')[1]}
                      </p>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-semibold text-gray-900">${pkg.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Credits:</span>
                        <span className="font-semibold text-purple-600">{pkg.credits}</span>
                      </div>
                    </div>
                    <Button className="w-full">Order Now</Button>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>

      {/* Active Orders */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Orders</h2>
        <div className="text-center py-12 text-gray-500">
          <Rocket className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active orders</p>
          <p className="text-sm mt-1">Your orders will appear here</p>
        </div>
      </Card>
    </div>
  )
}
