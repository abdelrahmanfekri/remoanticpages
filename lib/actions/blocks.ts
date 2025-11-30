'use server'

import { createClient } from '@/lib/supabase/server'
import type { BlockType, BlockContent, BlockSettings, PageBlock } from '@/types'

export interface CreateBlockData {
  pageId: string
  type: BlockType
  content?: BlockContent
  settings?: BlockSettings
  order?: number
}

export interface UpdateBlockData {
  content?: BlockContent
  settings?: BlockSettings
  order?: number
}

export async function createBlock(data: CreateBlockData): Promise<{ block?: PageBlock; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Verify page ownership
    const { data: page } = await supabase
      .from('pages')
      .select('user_id')
      .eq('id', data.pageId)
      .single()

    if (!page || page.user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    // Get next order if not provided
    let order = data.order
    if (order === undefined) {
      const { data: blocks } = await supabase
        .from('page_blocks')
        .select('display_order')
        .eq('page_id', data.pageId)
        .order('display_order', { ascending: false })
        .limit(1)

      order = blocks && blocks.length > 0 ? (blocks[0].display_order || 0) + 1 : 0
    }

    const { data: block, error } = await supabase
      .from('page_blocks')
      .insert({
        page_id: data.pageId,
        type: data.type,
        content: data.content || {},
        settings: data.settings || {},
        display_order: order,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { block: block as PageBlock }
  } catch (error) {
    console.error('Block creation error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function updateBlock(
  blockId: string,
  data: UpdateBlockData
): Promise<{ block?: PageBlock; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    // Verify ownership through page
    const { data: block } = await supabase
      .from('page_blocks')
      .select('page_id, pages!inner(user_id)')
      .eq('id', blockId)
      .single()

    if (!block || (block.pages as any).user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    const updateData: Record<string, unknown> = {}
    if (data.content !== undefined) updateData.content = data.content
    if (data.settings !== undefined) updateData.settings = data.settings
    if (data.order !== undefined) updateData.display_order = data.order

    const { data: updatedBlock, error } = await supabase
      .from('page_blocks')
      .update(updateData)
      .eq('id', blockId)
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { block: updatedBlock as PageBlock }
  } catch (error) {
    console.error('Block update error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function deleteBlock(blockId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: block } = await supabase
      .from('page_blocks')
      .select('page_id, pages!inner(user_id)')
      .eq('id', blockId)
      .single()

    if (!block || (block.pages as any).user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    const { error } = await supabase.from('page_blocks').delete().eq('id', blockId)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Block deletion error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function reorderBlocks(
  pageId: string,
  blockOrders: Array<{ id: string; order: number }>
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: page } = await supabase
      .from('pages')
      .select('user_id')
      .eq('id', pageId)
      .single()

    if (!page || page.user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    for (const { id, order } of blockOrders) {
      await supabase
        .from('page_blocks')
        .update({ display_order: order })
        .eq('id', id)
        .eq('page_id', pageId)
    }

    return { success: true }
  } catch (error) {
    console.error('Block reorder error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function duplicateBlock(blockId: string): Promise<{ block?: PageBlock; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: block } = await supabase
      .from('page_blocks')
      .select('*, pages!inner(user_id)')
      .eq('id', blockId)
      .single()

    if (!block || (block.pages as any).user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('display_order')
      .eq('page_id', block.page_id)
      .order('display_order', { ascending: false })
      .limit(1)

    const nextOrder = blocks && blocks.length > 0 ? (blocks[0].display_order || 0) + 1 : 0

    const { data: newBlock, error } = await supabase
      .from('page_blocks')
      .insert({
        page_id: block.page_id,
        type: block.type,
        content: block.content,
        settings: block.settings,
        display_order: nextOrder,
      })
      .select()
      .single()

    if (error) {
      return { error: error.message }
    }

    return { block: newBlock as PageBlock }
  } catch (error) {
    console.error('Block duplication error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function moveBlock(
  blockId: string,
  direction: 'up' | 'down'
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Unauthorized' }
    }

    const { data: currentBlock } = await supabase
      .from('page_blocks')
      .select('*, pages!inner(user_id)')
      .eq('id', blockId)
      .single()

    if (!currentBlock || (currentBlock.pages as any).user_id !== user.id) {
      return { error: 'Forbidden' }
    }

    const { data: allBlocks } = await supabase
      .from('page_blocks')
      .select('id, display_order')
      .eq('page_id', currentBlock.page_id)
      .order('display_order', { ascending: true })

    if (!allBlocks || allBlocks.length <= 1) {
      return { error: 'Cannot move block' }
    }

    const currentIndex = allBlocks.findIndex((b) => b.id === blockId)
    if (currentIndex === -1) {
      return { error: 'Block not found' }
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    
    if (targetIndex < 0 || targetIndex >= allBlocks.length) {
      return { error: 'Cannot move block in that direction' }
    }

    const targetBlock = allBlocks[targetIndex]
    const tempOrder = currentBlock.display_order

    await supabase
      .from('page_blocks')
      .update({ display_order: targetBlock.display_order })
      .eq('id', blockId)

    await supabase
      .from('page_blocks')
      .update({ display_order: tempOrder })
      .eq('id', targetBlock.id)

    return { success: true }
  } catch (error) {
    console.error('Block move error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

export async function getPageBlocks(pageId: string): Promise<{ blocks?: PageBlock[]; error?: string }> {
  try {
    const supabase = await createClient()

    const { data: blocks, error } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true })

    if (error) {
      return { error: error.message }
    }

    return { blocks: blocks as PageBlock[] }
  } catch (error) {
    console.error('Get blocks error:', error)
    return { error: error instanceof Error ? error.message : 'Internal server error' }
  }
}

