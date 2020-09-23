/*
Extract and validate tokens in the URL if they are present.
*/
import store from "@/store";
// import router from "../router";

/**
 * Reads the URL hash attempts and tries to detect if there is confirmation tokens from either an email signup or
 * external provider. If present it will call the relevant process to attempt to authorize the token.
 */
function detectTokens() {
    const emailToken = detectEmailConfirmationToken();
    const externalAccessToken = detectExternalAccessToken();
    const recoveryToken = detectRecoveryToken();

    if (emailToken) {
        //console.log("Detected email confirmation token", emailToken);
        confirmEmailToken(emailToken);
        return;
    } else if (externalAccessToken) {
        // console.log(
        //     "Detected external access token, received object for external login",
        //     externalAccessToken
        // );
        confirmExternalAccessToken(externalAccessToken);
        return;
    } else if (recoveryToken) {
        //console.log("found recovery token", recoveryToken);
        confirmRecoveryToken(recoveryToken);
        return;
    }

    //console.log("No tokens detected in URL hash");
}

/**
 * Checks URL hash for `confirmation_token=` then extracts the token which proceeds.
 */
function detectEmailConfirmationToken() {
    try {
        // split the hash where it detects `confirmation_token=`. The string which proceeds is the part which we want.
        const token = decodeURIComponent(document.location.hash).split(
            "confirmation_token="
        )[1];
        return token;
    } catch (error) {
        console.error(
            "Something went wrong when trying to extract email confirmation email",
            error
        );
        return null;
    }
}

/**
 * Checks URL hash for `access_token` then extracts, cleans and creates a params object which contains the JWT along
 * with other metadata.
 */
function detectExternalAccessToken() {
    try {
        const externalTokenRegex = /access_token=/;
        // Clean the URL
        const hash = (document.location.hash || "").replace(/^#\/?/, "");

        if (hash.match(externalTokenRegex)) {
            const params = {};
            //create token param from url hash
            hash.split("&").forEach(pair => {
                //each pair e.g 'token=f8fjCu9_MX_V5Eoci2iV8g' needs to split again so that we can construct key value pairs.
                const [key, value] = pair.split("=");
                params[key] = value;
            });
            return params;
        }
    } catch (error) {
        console.error(
            "Something went wrong trying to extract the access token",
            error
        );
        return null;
    }
}

function detectRecoveryToken() {
    try {
        // split the hash where it detects `confirmation_token=`. The string which proceeds is the part which we want.
        const token = decodeURIComponent(document.location.hash).split(
            "recovery_token="
        )[1];
        return token;
    } catch (error) {
        console.error(
            "Something went wrong when trying to extract email confirmation email",
            error
        );
        return null;
    }
}

/**
 * @param {string} token - authentication token used to confirm a user who has created an account via email signup.
 */
function confirmEmailToken(token) {
    let msg = { text: '', type: ''};
    store
        .dispatch("user/attemptConfirmation", token)
        .then(resp => {
            msg.text = `${resp.email} has been confirmed, please login`;
            msg.type = 'success';
            store.dispatch('app/sendToastMessage', msg)
        })
        .catch(error => {
            msg.text = `Can't authorize your account right now. Please try again`;
            msg.type = 'error';
            store.dispatch('app/sendToastMessage', msg)
            console.error(error, "Something's gone wrong confirming user");
        });
}

/**
 * @param {object} externalAccessTokenObject - object which includes the JWT along with metadata such as token type,
 *                                             refresh token, expiry time. only th JWT token is used current, but we
 *                                             send the whole object over just in case the other parts of the object
 *                                             might be useful for other things later.
 */
function confirmExternalAccessToken(externalAccessTokenObject) {
    store
        .dispatch("user/completeExternalLogin", externalAccessTokenObject)
        .then(() => {
            alert("You have successfully signed in via external provider");
        })
        .catch(error => {
            alert(`Can't authorize your account right now, try again`);
            console.error(error, "Somethings gone wrong logging in");
        });
}

function confirmRecoveryToken(recoveryToken) {
    store
        .dispatch("user/attemptPasswordRecovery", recoveryToken)
        .then(() => {
            // router.push("profile?showUpdateUserModal=true");
            alert("Account has been recovered. Update your password now.");
        })
        .catch(() => {
            alert(`Can't recover password`);
        });
}

export default function () {
    detectTokens();
}