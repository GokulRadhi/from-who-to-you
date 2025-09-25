import { supabase } from '../lib/supabaseClient'

export const messageAPI = {
  async sendMessage(content) {
    try {
      console.log('📤 Sending message...')
      
      const { data, error } = await supabase
        .from('messages')
        .insert([
          { 
            content: content.trim(),
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        throw new Error(`Failed to send message: ${error.message}`)
      }

      console.log('✅ Message sent successfully:', data)
      return { success: true, data }
    } catch (error) {
      console.error('❌ Send message error:', error)
      throw error
    }
  },

  async getMessages() {
    try {
      console.log('📥 Fetching messages...')
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Supabase select error:', error)
        throw new Error(`Failed to fetch messages: ${error.message}`)
      }

      console.log('✅ Messages fetched:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('❌ Get messages error:', error)
      throw error
    }
  },

  async getRandomMessage() {
    try {
      const messages = await this.getMessages()
      if (messages.length === 0) {
        console.log('📭 No messages available')
        return null
      }
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      console.log('🎲 Random message selected:', randomMessage.id)
      return randomMessage
    } catch (error) {
      console.error('❌ Get random message error:', error)
      throw error
    }
  }
}