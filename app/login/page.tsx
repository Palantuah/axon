import { login, signOut, signup } from './actions';
import { OAuthButtons } from './oauth-signin';

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Welcome Back</h2>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="mt-1 w-full p-2 border rounded-lg focus:ring focus:border"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="mt-1 w-full p-2 border rounded-lg focus:ring focus:border"
                        />
                    </div>
                    <button
                        formAction={login}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Log in
                    </button>
                    <button
                        formAction={signup}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Sign up
                    </button>
                    <button
                        formAction={signOut}
                        className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Sign Out
                    </button>
                </form>
            </div>
        </div>
    );
}
