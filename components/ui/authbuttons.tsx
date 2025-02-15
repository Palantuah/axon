import { createClient } from '@/utils/supabase/server';

export default async function AuthButtons() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        return (
            <>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <button
                        formAction={login}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Log in
                    </button>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <button formAction={signup} className="w-full relative group overflow-hidden rounded-full">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500 opacity-90
                                   group-hover:opacity-100 transition-opacity duration-500"
                        />
                        <span className="relative z-10 text-white">Sign up</span>
                    </button>
                </motion.div>
            </>
        );
    }

    // return (
    //     <form action="/logout" method="post">
    //         <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
    //             <button
    //                 formAction={logout}
    //                 className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
    //             >
    //                 Log in
    //             </button>
    //         </motion.div>
    //     </form>
    // );
}
