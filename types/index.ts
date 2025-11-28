import { Database } from './database'

export type Page = Database['public']['Tables']['pages']['Row']
export type Memory = Database['public']['Tables']['memories']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']
export type PageAnalytics = Database['public']['Tables']['page_analytics']['Row']


export interface PageWithRelations extends Page {
  memories: Memory[]
  media: Media[]
  analytics: PageAnalytics[]
}

