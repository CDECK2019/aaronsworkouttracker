import { createClient } from '@supabase/supabase-js';
import conf from '../conf/Conf';

const supabaseUrl = conf.supabaseUrl;
const supabaseAnonKey = conf.supabaseAnonKey;

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;
