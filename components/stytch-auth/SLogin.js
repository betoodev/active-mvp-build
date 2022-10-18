import { StytchLogin } from "@stytch/nextjs";
import { OAuthProvidersTypes, SDKProductTypes } from "@stytch/stytch-react";

// Now use Stytch in your components
const SLogin = () => {
  const stytchProps = {
    config: {
      //   products: ["emailMagicLinks"],
      //   emailMagicLinksOptions: {
      //     loginRedirectURL: "http://localhost:3000/",
      //     loginExpirationMinutes: 30,
      //     signupRedirectURL: "http://localhost:3000/",
      //     signupExpirationMinutes: 30,
      //     createUserAsPending: true,
      //   },
      //products: [SDKProductTypes.oauth, SDKProductTypes.emailMagicLinks],
      products: ["oauth", "emailMagicLinks"],
      emailMagicLinksOptions: {
        loginRedirectURL:
          process.env.NEXT_PUBLIC_BASE_URL + "/authenticate?type=em",
        loginExpirationMinutes: 30,
        signupRedirectURL:
          process.env.NEXT_PUBLIC_BASE_URL + "/authenticate?type=em",
        signupExpirationMinutes: 30,
        createUserAsPending: false,
      },
      oauthOptions: {
        providers: [
          { type: OAuthProvidersTypes.Google },
          { type: OAuthProvidersTypes.Apple },
          { type: OAuthProvidersTypes.Microsoft },
          { type: OAuthProvidersTypes.Facebook },
          { type: OAuthProvidersTypes.Github },
          { type: OAuthProvidersTypes.GitLab },
        ],
        loginRedirectURL:
          process.env.NEXT_PUBLIC_BASE_URL + "/authenticate?type=oauth",
        signupRedirectURL:
          process.env.NEXT_PUBLIC_BASE_URL + "/authenticate?type=oauth",
      },
    },
    styles: {
      fontFamily: '"Helvetica New", Helvetica, sans-serif',
      width: "321px",
      primaryColor: "#0577CA",
    },
    callbacks: {
      onEvent: (message) => console.log(message),
      onSuccess: (message) => console.log(message),
      onError: (message) => console.log(message),
    },
  };

  return (
    <div id="login">
      <StytchLogin
        config={stytchProps.config}
        styles={stytchProps.styles}
        callbacks={stytchProps.callbacks}
      />
    </div>
  );
};
export default SLogin;
