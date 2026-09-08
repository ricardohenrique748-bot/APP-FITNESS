import { supabase } from './supabaseClient';
import { GeneratedPlan } from '../types';

interface PlanRow {
  user_id: string;
  data: GeneratedPlan;
}

export async function loadPlan(userId: string): Promise<GeneratedPlan | null> {
  const { data, error } = await supabase.from('plans').select('data').eq('user_id', userId).maybeSingle<PlanRow>();

  if (error) {
    throw new Error(`Não foi possível carregar seu plano: ${error.message}`);
  }

  return data?.data ?? null;
}

export async function savePlan(userId: string, plan: GeneratedPlan): Promise<void> {
  const { error } = await supabase.from('plans').upsert({ user_id: userId, data: plan, updated_at: new Date().toISOString() });

  if (error) {
    throw new Error(`Não foi possível salvar seu plano: ${error.message}`);
  }
}
