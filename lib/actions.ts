'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type CreatePollInput = {
  title: string;
  description?: string;
  options: string[];
  userId: string;
};

export async function createPoll(data: CreatePollInput) {
  const supabase = createClient();
  const { title, description, options, userId } = data;
  
  // Validate input
  if (!title) {
    return { error: 'Title is required' };
  }
  
  const filteredOptions = options.filter(option => option.trim() !== '');
  if (filteredOptions.length < 2) {
    return { error: 'At least 2 options are required' };
  }
  
  try {
    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title,
        description: description || null,
        created_by: userId,
        is_active: true
      })
      .select()
      .single();
    
    if (pollError) {
      throw pollError;
    }
    
    // Add options to the poll
    const optionsData = filteredOptions.map((text, index) => ({
      poll_id: poll.id,
      text,
      position: index
    }));
    
    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData);
    
    if (optionsError) {
      throw optionsError;
    }
    
    // Revalidate the polls page to show the new poll
    revalidatePath('/polls');
    
    return { success: true, pollId: poll.id };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { error: 'Failed to create poll. Please try again.' };
  }
}