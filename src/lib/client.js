import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbexqzlgmxgvmjmpwzin.supabase.co';
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTg2ODIwMiwiZXhwIjoxOTU3NDQ0MjAyfQ.qYVwsVxsCeQFttckhTPhKv_VORQPlYVykDHkasuPsyE';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const getUser = () => {
	return supabase.auth.user();
};

const getSession = () => {
	return supabase.auth.session();
};

const signOut = async () => {
	const { error } = await supabase.auth.signOut();
	return { data: !error, error };
};

const signInWithDiscord = async (redirect) => {
	const { error } = await supabase.auth.signIn(
		{
			provider: 'discord'
		},
		{ redirectTo: redirect }
	);
	return { data: !error, error };
};

export { supabase, signInWithDiscord, getUser, getSession, signOut };
