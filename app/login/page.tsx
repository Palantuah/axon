import { login, signOut, signup } from './actions';
import { OAuthButtons } from './oauth-signin';

export default function LoginPage() {
    return (
        <>
            <form>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button formAction={login}>Log in</button>
                <button formAction={signup}>Sign up</button>
            </form>
            <form formAction={signOut}>
                <button formAction={oAuthSignIn}>Sign out</button>
            </form>

            <OAuthButtons />
        </>
    );
}
